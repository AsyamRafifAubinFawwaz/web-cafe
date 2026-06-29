import { Star, MessageSquarePlus, User, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    date: string;
    isCustom?: boolean;
}

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([
        {
            id: 1,
            name: 'Siska Rahmawati',
            rating: 5,
            comment: 'Tempatnya super cozy! WiFi kencang banget cocok buat nugas seharian. Kopi Susu Aren-nya juara manisnya pas!',
            date: '2 hari lalu'
        },
        {
            id: 2,
            name: 'Angga Pratama',
            rating: 5,
            comment: 'Sangat terbantu dengan opsi reservasi rombongan menggunakan Room Link. Rekap pesanan komunitas jadi rapi tanpa repot chat manual.',
            date: '1 minggu lalu'
        },
        {
            id: 3,
            name: 'Kukuh Prasetyo',
            rating: 4,
            comment: 'Makanannya enak-enak terutama Spaghetti Aglio Olio dan Waffle es krimnya. Pelayanan ramah, baristanya asyik diajak diskusi kopi.',
            date: '2 minggu lalu'
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Calculate Average Rating
    const averageRating = (
        reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
    ).toFixed(1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newReview.name || !newReview.comment) {
return;
}

        const newId = reviews.length + 1;
        const reviewToAdd: Review = {
            id: newId,
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: 'Baru saja',
            isCustom: true
        };

        setReviews([reviewToAdd, ...reviews]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setSubmitSuccess(true);
        setTimeout(() => {
            setSubmitSuccess(false);
            setShowForm(false);
        }, 2000);
    };

    return (
        <section id="reviews" className="bg-cafe-white py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center max-w-2xl mx-auto">
                    <span className="text-sm font-semibold tracking-wider text-cafe-primary uppercase">
                        Testimoni Pelanggan
                    </span>
                    <h2 className="mt-2 font-chewy text-4xl sm:text-5xl text-cafe-secondary">
                        Apa Kata Mereka Tentang Kami?
                    </h2>
                    <p className="mt-4 font-poppins text-sm sm:text-base text-cafe-secondary/70">
                        Kepuasan Anda adalah prioritas kami. Berikut adalah ulasan jujur dari para pelanggan setia yang menikmati hari-harinya di Motrack Cafe.
                    </p>
                </div>

                {/* Rating Stats Box & Action */}
                <div className="mt-12 flex flex-col md:flex-row gap-8 items-center justify-between bg-cafe-bg p-8 rounded-3xl border border-cafe-secondary/5 shadow-sm max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-6 items-center text-center sm:text-left">
                        <div className="text-5xl md:text-6xl font-chewy text-cafe-secondary">
                            {averageRating}
                            <span className="text-xl md:text-2xl text-cafe-secondary/40 font-poppins">/5</span>
                        </div>
                        <div>
                            {/* Stars */}
                            <div className="flex gap-1 justify-center sm:justify-start">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${
                                            i < Math.round(parseFloat(averageRating))
                                                ? 'fill-cafe-primary text-cafe-primary'
                                                : 'text-cafe-secondary/20'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="mt-2 font-poppins text-xs text-cafe-secondary/60">
                                Berdasarkan total <strong className="text-cafe-secondary">{reviews.length} ulasan</strong> pelanggan kami
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-4 bg-cafe-primary hover:bg-cafe-primary/95 text-white font-poppins font-bold text-xs rounded-xl shadow-lg shadow-cafe-primary/20 hover:shadow-xl active:scale-95 transition-all w-full sm:w-auto justify-center"
                    >
                        <MessageSquarePlus className="h-4 w-4" />
                        Tulis Ulasan Anda
                    </button>
                </div>

                {/* Write Review Form Drawer */}
                {showForm && (
                    <div className="mt-6 bg-cafe-bg/40 p-6 rounded-3xl border border-dashed border-cafe-primary/20 max-w-xl mx-auto animate-fade-in">
                        {submitSuccess ? (
                            <div className="flex flex-col items-center text-center py-6 animate-scale-in">
                                <CheckCircle2 className="h-12 w-12 text-green-600 mb-3" />
                                <h4 className="font-chewy text-lg text-cafe-secondary">Terima Kasih Banyak!</h4>
                                <p className="font-poppins text-xs text-cafe-secondary/70 mt-1">
                                    Ulasan Anda berhasil ditambahkan dan ditayangkan langsung.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <h3 className="font-chewy text-lg text-cafe-secondary">Beri Masukan / Nilai Kami</h3>
                                
                                <div>
                                    <label className="font-poppins text-2xs font-bold text-cafe-secondary/80 uppercase block mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Masukkan nama Anda..."
                                        value={newReview.name}
                                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl font-poppins text-xs bg-white border border-cafe-secondary/10 focus:border-cafe-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="font-poppins text-2xs font-bold text-cafe-secondary/80 uppercase block mb-1">Peringkat (Rating)</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                className="focus:outline-none transition-transform active:scale-125"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${
                                                        star <= newReview.rating
                                                            ? 'fill-cafe-primary text-cafe-primary'
                                                            : 'text-cafe-secondary/20 hover:text-cafe-primary/50'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="font-poppins text-2xs font-bold text-cafe-secondary/80 uppercase block mb-1">Ulasan Anda</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Tulis ulasan jujur Anda tentang rasa kopi, suasana, atau pelayanan kami..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl font-poppins text-xs bg-white border border-cafe-secondary/10 focus:border-cafe-primary focus:outline-none transition-colors"
                                    />
                                </div>

                                <div className="flex gap-3 mt-2">
                                    <button
                                        type="submit"
                                        className="flex-1 py-3.5 bg-cafe-primary text-white font-poppins font-bold text-xs rounded-xl shadow-md hover:bg-cafe-primary/95 transition-colors"
                                    >
                                        Kirim Ulasan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-3.5 bg-cafe-secondary/10 text-cafe-secondary font-poppins font-bold text-xs rounded-xl hover:bg-cafe-secondary/20 transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* Review Testimonial Cards Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((rev) => (
                        <div
                            key={rev.id}
                            className={`p-6 rounded-3xl bg-cafe-bg border shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                                rev.isCustom 
                                    ? 'border-cafe-primary/20 bg-cafe-primary/5' 
                                    : 'border-cafe-secondary/5'
                            }`}
                        >
                            <div>
                                {/* Rating Stars */}
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${
                                                i < rev.rating
                                                    ? 'fill-cafe-primary text-cafe-primary'
                                                    : 'text-cafe-secondary/20'
                                            }`}
                                        />
                                    ))}
                                </div>

                                <p className="mt-4 font-poppins text-xs sm:text-sm text-cafe-secondary/80 italic leading-relaxed">
                                    "{rev.comment}"
                                </p>
                            </div>

                            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-cafe-secondary/5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cafe-secondary text-cafe-bg">
                                    <User className="h-4 w-4" />
                                </div>
                                <div>
                                    <h4 className="font-poppins font-bold text-xs text-cafe-secondary">
                                        {rev.name}
                                    </h4>
                                    <span className="text-[10px] text-cafe-secondary/40 font-poppins">
                                        {rev.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
