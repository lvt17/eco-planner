import React from 'react';
import { Leaf, Target, Eye, Sparkles, CheckCircle, Heart, Recycle, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
   const coreValues = [
      {
         icon: CheckCircle,
         title: 'Rõ ràng',
         description: 'Thiết kế tối ưu để dễ dùng, dễ theo dõi, dễ duy trì thói quen.',
         color: 'bg-blue-50 text-blue-600'
      },
      {
         icon: Recycle,
         title: 'Bền vững',
         description: 'Ưu tiên vật liệu và quy trình giảm lãng phí, bắt đầu từ bìa giấy tái chế.',
         color: 'bg-green-50 text-green-600'
      },
      {
         icon: Award,
         title: 'Chất lượng',
         description: 'Chú trọng trải nghiệm viết, độ bền, hoàn thiện chỉn chu.',
         color: 'bg-amber-50 text-amber-600'
      },
      {
         icon: Users,
         title: 'Đồng hành',
         description: 'Luôn ở bên người dùng trong từng giai đoạn - từ lập kế hoạch đến bắt đầu lại nhẹ nhàng.',
         color: 'bg-purple-50 text-purple-600'
      }
   ];

   return (
      <div className="overflow-hidden">
         {/* Hero Section */}
         <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 px-4 flex justify-center overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center max-w-[900px]">
               <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-6 mx-auto">
                  <Leaf className="w-4 h-4" /> Câu chuyện thương hiệu
               </div>
               <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-charcoal mb-6">
                  Viết điều bạn muốn.<br />
                  <span className="text-primary">Sống điều bạn tin.</span>
               </h1>
               <p className="text-lg md:text-xl text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
                  Và tái tạo từng ngày.
               </p>
            </div>
         </section>

         {/* The Question */}
         <section className="py-16 md:py-24 px-6 bg-primary/5">
            <div className="max-w-4xl mx-auto text-center">
               <div className="relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-8xl md:text-9xl font-display font-bold text-primary/10">"</div>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-charcoal leading-relaxed relative z-10 pt-8">
                     Nếu mỗi ngày mình đều lập kế hoạch để sống tốt hơn, tại sao cuốn sổ đồng hành lại không thể tốt hơn cho Trái Đất?
                  </p>
               </div>
               <p className="mt-8 text-charcoal/60 text-lg">— Câu hỏi khởi nguồn của MEDE</p>
            </div>
         </section>

         {/* Brand Story */}
         <section className="py-16 md:py-24 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <div className="relative order-2 lg:order-1">
                     <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary/20 rounded-3xl transform -rotate-3"></div>
                     <div className="relative w-full aspect-[4/5] bg-stone-200 rounded-3xl overflow-hidden shadow-2xl">
                        <img
                           src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"
                           className="w-full h-full object-cover"
                           alt="MEDE Planner"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                           <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-charcoal">
                              <Recycle className="w-4 h-4 text-primary" /> Bìa giấy tái chế 100%
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-6 order-1 lg:order-2">
                     <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Heart className="w-7 h-7" />
                     </div>
                     <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal">
                        Một cách làm sổ planner khác
                     </h2>
                     <div className="space-y-4 text-charcoal/70 text-lg leading-relaxed">
                        <p>
                           Chúng ta đã quá quen với những năm tháng chạy vội: công việc chồng lên công việc, mục tiêu chồng lên mục tiêu. Khi mọi thứ trở nên rối, con người thường tìm về một điều đơn giản để tự cứu mình: <strong className="text-charcoal">viết ra</strong>.
                        </p>
                        <p>
                           Nhưng phía sau sự "rõ ràng" ấy, đôi khi lại là những lựa chọn chưa thật sự "nhẹ" với môi trường. Vậy là MEDE chọn làm sổ planner theo một cách khác.
                        </p>
                        <p>
                           Chúng mình bắt đầu với <strong className="text-primary">bìa giấy tái chế</strong> – không phải vì đó là "xu hướng", mà vì nó mang đúng tinh thần của việc lập kế hoạch: <strong className="text-charcoal">tái tạo</strong>.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Mission & Vision */}
         <section className="py-16 md:py-24 px-6 bg-charcoal text-white">
            <div className="max-w-6xl mx-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {/* Mission */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 hover:border-primary/30 transition-colors">
                     <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                        <Target className="w-7 h-7" />
                     </div>
                     <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Sứ mệnh</h3>
                     <p className="text-white/70 text-lg leading-relaxed">
                        Giúp mọi người lập kế hoạch sống rõ ràng hơn mỗi ngày với những cuốn planner <strong className="text-white">đẹp – bền – thân thiện môi trường</strong>, bắt đầu từ bìa giấy tái chế.
                     </p>
                  </div>

                  {/* Vision */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-white/10 hover:border-primary/30 transition-colors">
                     <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                        <Eye className="w-7 h-7" />
                     </div>
                     <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">Tầm nhìn</h3>
                     <p className="text-white/70 text-lg leading-relaxed">
                        Trở thành thương hiệu planner được yêu thích vì tính hữu ích và lối sống bền vững, nơi mỗi cuốn sổ là một <strong className="text-white">lựa chọn tử tế</strong> với bản thân và Trái Đất.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* Core Values */}
         <section className="py-16 md:py-24 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
               <div className="text-center mb-12 md:mb-16">
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-bold tracking-wider uppercase mb-4">
                     <Sparkles className="w-4 h-4" /> Giá trị cốt lõi
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-charcoal">
                     Điều chúng mình tin tưởng
                  </h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {coreValues.map((value, index) => (
                     <div
                        key={index}
                        className="group bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:-translate-y-1"
                     >
                        <div className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                           <value.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-charcoal mb-3">{value.title}</h3>
                        <p className="text-charcoal/60 leading-relaxed">{value.description}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Belief Quote */}
         <section className="py-16 md:py-24 px-6 bg-secondary/10">
            <div className="max-w-4xl mx-auto text-center">
               <Leaf className="w-12 h-12 text-primary mx-auto mb-6" />
               <p className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-charcoal leading-relaxed mb-6">
                  "Một kế hoạch tốt không chỉ giúp bạn hoàn thành nhiều việc hơn, mà giúp bạn <span className="text-primary">sống đúng hơn</span>."
               </p>
               <p className="text-charcoal/60 text-lg">
                  Một cuốn sổ planner tốt không chỉ đẹp trên bàn làm việc, mà còn tử tế với thế giới mà bạn đang xây tương lai trong đó.
               </p>
            </div>
         </section>

         {/* CTA */}
         <section className="py-16 md:py-24 px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-charcoal to-charcoal/90 text-white rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>

               <div className="relative z-10 flex flex-col items-center gap-6">
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-tight">
                     Sẵn sàng lập kế hoạch<br />một cách nhẹ nhàng hơn?
                  </h2>
                  <p className="text-white/70 text-lg max-w-xl">
                     Cho cả bạn và cho hành tinh này.
                  </p>
                  <Link
                     to="/shop"
                     className="inline-flex items-center gap-2 h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
                  >
                     Khám phá sản phẩm <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>
         </section>
      </div>
   );
};

export default About;