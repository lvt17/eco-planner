import React from 'react';
import { ArrowRight, Mail, Lightbulb, Play } from 'lucide-react';

const Blog: React.FC = () => {
  return (
    <div className="px-4 md:px-10 lg:px-40 py-8 md:py-12 bg-cream min-h-screen">
       <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
             <div className="flex max-w-2xl flex-col gap-4">
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">Journal</span>
                <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-charcoal md:text-5xl lg:text-6xl">Góc Yên Tĩnh</h1>
                <p className="text-lg font-medium leading-relaxed text-charcoal/60 md:text-xl md:max-w-lg">Chậm lại một chút để tìm thấy sự cân bằng trong cuộc sống bận rộn.</p>
             </div>
             <button className="group flex items-center gap-2 rounded-2xl bg-charcoal px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary shadow-lg">
                <Mail className="w-5 h-5" /> Đăng ký nhận tin
             </button>
          </div>

          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-3 overflow-x-auto pb-2 hide-scrollbar">
             {['Tất cả', 'Sống chậm', 'Mẹo lập kế hoạch', 'Bảo vệ môi trường', 'Journaling'].map((filter, idx) => (
               <button key={idx} className={`h-10 items-center justify-center rounded-full px-6 text-sm font-semibold transition-all ${idx === 0 ? 'bg-charcoal text-white shadow-md' : 'bg-paper border border-stone-200 text-charcoal hover:border-primary hover:text-primary'}`}>
                 {filter}
               </button>
             ))}
          </div>

          {/* Masonry Grid (Simulated with columns) */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
             {/* Post 1 */}
             <article className="break-inside-avoid rounded-2xl bg-paper p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer group">
                <div className="relative mb-4 overflow-hidden rounded-xl">
                   <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop" className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Blog" />
                   <span className="absolute right-3 top-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-bold text-charcoal backdrop-blur-md">5 min read</span>
                </div>
                <div className="flex flex-col gap-3 px-2 pb-2">
                   <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">Sống chậm</span>
                      <span className="text-xs font-medium text-charcoal/50">Oct 24, 2023</span>
                   </div>
                   <h3 className="font-display text-2xl font-bold leading-tight text-charcoal group-hover:text-primary transition-colors">Finding Peace in Daily Planning</h3>
                   <p className="text-sm leading-relaxed text-charcoal/60 line-clamp-3">Tại sao việc viết ra kế hoạch mỗi sáng lại giúp bạn giảm bớt lo âu? Khám phá 3 phương pháp...</p>
                   <div className="mt-2 flex items-center gap-1 text-sm font-bold text-primary">Đọc tiếp <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/></div>
                </div>
             </article>

             {/* Post 2: Quote */}
             <article className="break-inside-avoid rounded-2xl bg-primary/10 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer group border border-primary/10">
                <div className="flex flex-col gap-4">
                   <span className="text-4xl text-primary">"</span>
                   <h3 className="font-display text-3xl font-bold leading-tight text-charcoal italic">Less but better. Đơn giản hóa cuộc sống không phải là vứt bỏ đồ đạc.</h3>
                   <div className="mt-4 flex items-center justify-between border-t border-primary/20 pt-4">
                      <span className="font-bold text-charcoal">Dieter Rams</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">Quote</span>
                   </div>
                </div>
             </article>

              {/* Post 3 */}
             <article className="break-inside-avoid rounded-2xl bg-paper p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer group">
                <div className="relative mb-4 overflow-hidden rounded-xl aspect-[3/4]">
                   <img src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=800&auto=format&fit=crop" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Leaves" />
                </div>
                <div className="flex flex-col gap-3 px-2 pb-2">
                   <div className="flex items-center gap-2">
                      <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">Bảo vệ môi trường</span>
                   </div>
                   <h3 className="font-display text-xl font-bold leading-tight text-charcoal group-hover:text-primary transition-colors">Sustainable Stationery Choices for 2024</h3>
                </div>
             </article>

             {/* Post 4: Tip */}
             <article className="break-inside-avoid rounded-2xl bg-accent p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer group text-white">
                <div className="flex flex-col gap-4">
                   <div className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5"/>
                      <span className="font-bold text-sm uppercase tracking-wide opacity-90">Quick Tip</span>
                   </div>
                   <h3 className="font-display text-2xl font-bold leading-tight">Pomodoro không chỉ để làm việc.</h3>
                   <p className="opacity-90 leading-relaxed">Hãy thử dùng 25 phút tập trung để dọn dẹp, đọc sách, hoặc thậm chí là... không làm gì cả.</p>
                </div>
             </article>

             {/* Post 5 */}
             <article className="break-inside-avoid rounded-2xl bg-paper p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer group border-l-4 border-primary">
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="flex size-6 items-center justify-center rounded-full bg-primary text-white"><Play className="w-3 h-3 fill-current" /></div>
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">Podcast</span>
                   </div>
                   <h3 className="font-display text-xl font-bold leading-tight text-charcoal group-hover:text-primary transition-colors">Ep 12: Digital Minimalism với Cal Newport</h3>
                </div>
             </article>
          </div>
       </div>
    </div>
  );
};

export default Blog;