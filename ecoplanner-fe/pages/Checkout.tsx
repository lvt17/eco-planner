import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api, ShippingAddress } from '../services/api';

type PaymentMethod = 'MOMO' | 'VNPAY' | 'COD' | 'BANK';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ShippingAddress>({
        name: user?.name || '',
        phone: '',
        address: '',
        city: '',
        district: '',
        ward: '',
    });
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MOMO');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

    const shippingFee = totalPrice >= 500000 ? 0 : 30000;
    const discount = shippingFee > 0 ? 15000 : 30000;
    const finalTotal = totalPrice + shippingFee - discount;

    // Redirect if not logged in
    if (!isAuthenticated) {
        return (
            <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
                <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Vui lòng đăng nhập</h2>
                <p className="text-charcoal/60 mb-6">Bạn cần đăng nhập để thanh toán</p>
                <Link to="/login" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full">
                    Đăng nhập
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-[800px] mx-auto px-6 py-20 text-center">
                <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Giỏ hàng trống</h2>
                <p className="text-charcoal/60 mb-6">Vui lòng thêm sản phẩm trước khi thanh toán</p>
                <Link to="/shop" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-full">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitInfo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.address || !formData.city) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setError('');
        setStep(2);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setError('');

        try {
            // Step 1: Create order
            const orderData = {
                items: items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
                shippingAddress: formData,
                paymentMethod,
            };

            const { order } = await api.createOrder(orderData);

            // Step 2: Process payment based on method
            if (paymentMethod === 'MOMO') {
                const result = await api.createMomoPayment(order.id);
                if (result.payUrl) {
                    clearCart();
                    window.location.href = result.payUrl;
                    return;
                }
            } else if (paymentMethod === 'VNPAY') {
                const result = await api.createVnpayPayment(order.id);
                if (result.payUrl) {
                    clearCart();
                    window.location.href = result.payUrl;
                    return;
                }
            } else if (paymentMethod === 'COD' || paymentMethod === 'BANK') {
                await api.confirmCodOrder(order.id);
                clearCart();
                navigate(`/order-success?orderId=${order.id}&method=${paymentMethod}`);
                return;
            }

            setError('Không thể tạo thanh toán. Vui lòng thử lại.');
        } catch (err: unknown) {
            const error = err as Error;
            setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper">
            {/* Progress Bar */}
            <div className="max-w-[1200px] mx-auto px-6 pt-8">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-6 justify-between items-center">
                        <p className="text-primary text-lg font-bold">
                            {step === 1 ? '1. Thông tin giao hàng' : '2. Thanh toán'}
                        </p>
                        <p className="text-primary/60 text-sm font-medium">Bước {step} trên 2</p>
                    </div>
                    <div className="rounded-full bg-primary/10 h-1.5 overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${step * 50}%` }}></div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1200px] mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Left Section */}
                    <div className="flex-1 flex flex-col gap-8">
                        {step === 1 ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-primary text-3xl font-black tracking-tight">Chi tiết vận chuyển</h1>
                                    <p className="text-primary/60 text-base">Nhập thông tin để chúng tôi gửi đơn hàng đến sớm nhất.</p>
                                </div>

                                <form onSubmit={handleSubmitInfo} className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-primary text-sm font-bold">Họ và tên *</label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-2xl p-4 text-primary text-base placeholder:text-primary/30 h-14 bg-cream border border-transparent focus:border-primary focus:outline-none"
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-primary text-sm font-bold">Số điện thoại *</label>
                                            <input
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-2xl p-4 text-primary text-base placeholder:text-primary/30 h-14 bg-cream border border-transparent focus:border-primary focus:outline-none"
                                                placeholder="090x xxx xxx"
                                                type="tel"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-primary text-sm font-bold">Địa chỉ chi tiết *</label>
                                            <input
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full rounded-2xl p-4 text-primary text-base placeholder:text-primary/30 h-14 bg-cream border border-transparent focus:border-primary focus:outline-none"
                                                placeholder="Số nhà, tên đường..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-primary text-sm font-bold">Tỉnh / Thành *</label>
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full rounded-2xl p-4 text-primary text-base h-14 bg-cream border border-transparent focus:border-primary focus:outline-none"
                                                >
                                                    <option value="">Chọn tỉnh thành</option>
                                                    <option value="hcm">TP. Hồ Chí Minh</option>
                                                    <option value="hn">Hà Nội</option>
                                                    <option value="dn">Đà Nẵng</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-primary text-sm font-bold">Quận / Huyện</label>
                                                <select
                                                    name="district"
                                                    value={formData.district}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-2xl p-4 text-primary text-base h-14 bg-cream border border-transparent focus:border-primary focus:outline-none"
                                                >
                                                    <option value="">Chọn quận huyện</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-primary text-sm font-bold">Phường / Xã</label>
                                                <select
                                                    name="ward"
                                                    value={formData.ward}
                                                    onChange={handleInputChange}
                                                    className="w-full rounded-2xl p-4 text-primary text-base h-14 bg-cream border border-transparent focus:border-primary focus:outline-none"
                                                >
                                                    <option value="">Chọn phường xã</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
                                        <Link to="/cart" className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-sm font-bold">
                                            <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
                                        </Link>
                                        <button type="submit" className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all w-full md:w-auto">
                                            Tiếp tục thanh toán
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-primary text-3xl font-black tracking-tight">Phương thức thanh toán</h1>
                                    <p className="text-primary/60 text-base">Chọn phương thức thanh toán phù hợp nhất.</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {/* MoMo */}
                                    <label className={`group relative flex flex-col items-center p-6 bg-white border-2 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'MOMO' ? 'border-primary ring-2 ring-primary ring-offset-4' : 'border-stone-200'}`}>
                                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'MOMO'} onChange={() => setPaymentMethod('MOMO')} />
                                        <div className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center bg-pink-100">
                                            <span className="text-3xl">📱</span>
                                        </div>
                                        <h3 className="font-bold text-base mb-1">MoMo</h3>
                                        <p className="text-xs text-center text-stone-500">Ví điện tử</p>
                                    </label>

                                    {/* VNPAY */}
                                    <label className={`group relative flex flex-col items-center p-6 bg-white border-2 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'VNPAY' ? 'border-primary ring-2 ring-primary ring-offset-4' : 'border-stone-200'}`}>
                                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} />
                                        <div className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center bg-blue-100">
                                            <span className="text-3xl">💳</span>
                                        </div>
                                        <h3 className="font-bold text-base mb-1">VNPay</h3>
                                        <p className="text-xs text-center text-stone-500">ATM / Visa / QR</p>
                                    </label>

                                    {/* COD */}
                                    <label className={`group relative flex flex-col items-center p-6 bg-white border-2 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'COD' ? 'border-primary ring-2 ring-primary ring-offset-4' : 'border-stone-200'}`}>
                                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                        <div className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center bg-orange-100">
                                            <span className="text-3xl">🚚</span>
                                        </div>
                                        <h3 className="font-bold text-base mb-1">COD</h3>
                                        <p className="text-xs text-center text-stone-500">Thanh toán khi nhận</p>
                                    </label>

                                    {/* Bank Transfer */}
                                    <label className={`group relative flex flex-col items-center p-6 bg-white border-2 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md ${paymentMethod === 'BANK' ? 'border-primary ring-2 ring-primary ring-offset-4' : 'border-stone-200'}`}>
                                        <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'BANK'} onChange={() => setPaymentMethod('BANK')} />
                                        <div className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center bg-green-100">
                                            <span className="text-3xl">🏦</span>
                                        </div>
                                        <h3 className="font-bold text-base mb-1">Chuyển khoản</h3>
                                        <p className="text-xs text-center text-stone-500">Banking</p>
                                    </label>
                                </div>

                                {/* Payment Info */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                    {paymentMethod === 'MOMO' && (
                                        <p className="text-stone-600">Bạn sẽ được chuyển đến trang thanh toán MoMo. Sau khi thanh toán thành công, đơn hàng sẽ được xác nhận tự động.</p>
                                    )}
                                    {paymentMethod === 'VNPAY' && (
                                        <p className="text-stone-600">Bạn sẽ được chuyển đến trang thanh toán VNPay. Hỗ trợ ATM nội địa, Visa/Mastercard và QR Code.</p>
                                    )}
                                    {paymentMethod === 'COD' && (
                                        <p className="text-stone-600">Thanh toán bằng tiền mặt khi nhận hàng. Vui lòng chuẩn bị đúng số tiền <strong>{formatPrice(finalTotal)}</strong>.</p>
                                    )}
                                    {paymentMethod === 'BANK' && (
                                        <div className="space-y-2">
                                            <p className="text-stone-600">Chuyển khoản đến tài khoản:</p>
                                            <div className="bg-stone-50 p-4 rounded-xl text-sm space-y-1">
                                                <p><strong>Ngân hàng:</strong> Vietcombank</p>
                                                <p><strong>Số TK:</strong> 1234567890</p>
                                                <p><strong>Chủ TK:</strong> MEDE STORE</p>
                                                <p><strong>Số tiền:</strong> {formatPrice(finalTotal)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6">
                                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-sm font-bold">
                                        <ArrowLeft className="w-4 h-4" /> Quay lại
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                Xác nhận thanh toán <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Sidebar - Order Summary */}
                    <aside className="w-full lg:w-[380px]">
                        <div className="bg-cream rounded-2xl p-8 sticky top-24 shadow-sm">
                            <h3 className="text-primary text-xl font-extrabold mb-6">Đơn hàng của bạn</h3>

                            {/* Item List */}
                            <div className="flex flex-col gap-4 mb-6 border-b border-primary/10 pb-6 max-h-[300px] overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4">
                                        <div
                                            className="w-16 h-16 rounded-xl bg-white overflow-hidden flex-shrink-0 border border-primary/5 bg-cover bg-center"
                                            style={{ backgroundImage: `url('${item.product.image}')` }}
                                        />
                                        <div className="flex flex-col justify-center gap-1">
                                            <p className="text-primary font-bold text-sm leading-snug">{item.product.name}</p>
                                            <p className="text-primary/50 text-xs">SL: {item.quantity}</p>
                                            <p className="text-primary font-extrabold text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="flex flex-col gap-3 mb-6">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-primary/60">Tạm tính</span>
                                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-primary/60">Phí vận chuyển</span>
                                    <span className="text-primary">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-primary/60">Giảm giá</span>
                                    <span className="text-green-600">-{formatPrice(discount)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-primary/10">
                                <span className="text-primary font-bold">Tổng cộng</span>
                                <span className="text-primary text-2xl font-black">{formatPrice(finalTotal)}</span>
                            </div>

                            <div className="mt-6 p-4 bg-primary/5 rounded-xl flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                                <p className="text-[11px] text-primary/70 leading-relaxed uppercase tracking-wider font-bold">
                                    Mọi thanh toán đều được mã hóa an toàn. Chúng tôi ưu tiên trải nghiệm bình yên của bạn.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Checkout;
