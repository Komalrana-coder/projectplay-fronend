"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      question: "How do I book a match?",
      answer:
        "Simply browse available courts in your area, select your preferred time slot, and confirm your booking.",
    },
    {
      question: "Can I cancel or reschedule my booking?",
      answer:
        "Yes, you can cancel or reschedule up to 24 hours before the match time.",
    },
    {
      question: "How does payment work?",
      answer:
        "Payments are processed securely. You can use cards or digital payment methods.",
    },
    {
      question: "What if I can't find other players?",
      answer: "You can invite friends or join open matches created by others.",
    },
    {
      question: "What sports are available",
      answer:
        "Currently, Project Play App supports Padel tennis and pickleball. We're constantly expanding to include more racquet sports based on user demand in different regions.",
    },
  ];

  const toggleFAQ = (index:number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Book Padel & <br />
            Pickleball Matches <span className="text-blue-600">Instantly</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">
            Discover courts, schedule games, and play your favorite sports — all
            in one place. Connect with players and never miss a match again.
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              📅 Book Now
            </button>
          </div>

          {/* SMALL POINTS */}
          <div className="flex gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Real-time availability
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Instant booking
            </span>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="/padels.jpg"
            alt="padel"
            className="rounded-3xl shadow-xl w-[350px] md:w-[420px]"
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="howItWorks" className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Get on the court in three simple steps. It's never been easier to
            find and book your next match.
          </p>

          {/* Steps */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-12">
            {/* STEP 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                🔍
              </div>

              <div className="mt-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                1
              </div>

              <h3 className="mt-4 text-lg font-semibold">Choose Your Game</h3>

              <p className="text-gray-500 mt-2 max-w-xs">
                Select from padel or pickleball matches in your area. Filter by
                skill level and court type.
              </p>
            </div>

            {/* LINE */}
            <div className="hidden md:block w-20 h-1 bg-gray-300 relative">
              <div className="w-3 h-3 bg-blue-600 rounded-full absolute left-1/2 -translate-x-1/2 -top-1"></div>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                📍
              </div>

              <div className="mt-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                2
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Pick Location & Time
              </h3>

              <p className="text-gray-500 mt-2 max-w-xs">
                Browse available courts near you. Check real-time availability
                and choose your preferred slot.
              </p>
            </div>

            {/* LINE */}
            <div className="hidden md:block w-24 h-1 bg-gray-300 relative">
              <div className="w-3 h-3 bg-blue-600 rounded-full absolute left-1/2 -translate-x-1/2 -top-1"></div>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                📅
              </div>

              <div className="mt-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                3
              </div>

              <h3 className="mt-4 text-lg font-semibold">Book and Play</h3>

              <p className="text-gray-500 mt-2 max-w-xs">
                Confirm your booking instantly. Get reminders and connect with
                other players before the match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900">
            Why Choose Project Play App?
          </h2>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Everything you need to discover, book, and enjoy Padel and
            pickleball matches with fellow enthusiasts.
          </p>

          {/* Cards Grid */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* CARD 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                ⏱️
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Real-time Availability
              </h3>
              <p className="text-gray-500 mt-2">
                See live court availability and book instantly without waiting
                for confirmations.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                👥
              </div>
              <h3 className="mt-4 text-lg font-semibold">Easy Group Booking</h3>
              <p className="text-gray-500 mt-2">
                Invite friends or join existing groups. Perfect for doubles
                matches and tournaments.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                🔔
              </div>
              <h3 className="mt-4 text-lg font-semibold">Smart Reminders</h3>
              <p className="text-gray-500 mt-2">
                Get notified about upcoming matches and easily manage
                cancellations if plans change.
              </p>
            </div>

            {/* CARD 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                🛡️
              </div>
              <h3 className="mt-4 text-lg font-semibold">Secure Payments</h3>
              <p className="text-gray-500 mt-2">
                Safe and secure payment processing with instant booking
                confirmations.
              </p>
            </div>

            {/* CARD 5 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                ⭐
              </div>
              <h3 className="mt-4 text-lg font-semibold">Player Ratings</h3>
              <p className="text-gray-500 mt-2">
                Rate and review players to build a trusted community of sports
                enthusiasts.
              </p>
            </div>

            {/* CARD 6 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition text-left">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xl">
                ⚡
              </div>
              <h3 className="mt-4 text-lg font-semibold">Instant Matching</h3>
              <p className="text-gray-500 mt-2">
                Get matched with players of similar skill levels for competitive
                and fun games.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="Faq" className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-center text-gray-900">
            Frequently Asked Questions
          </h2>

          <p className="text-gray-600 text-center mt-4">
            Got questions? We've got answers. Find everything you need to know
            about booking matches.
          </p>

          {/* FAQ LIST */}
          <div className="max-w-2xl mx-auto mt-10 space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4 cursor-pointer">
                {/* Question */}
                <div
                  className="flex justify-between items-center"
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                >
                  <h3 className="font-semibold">{faq.question}</h3>
                  <span>{openIndex === index ? "▲" : "▼"}</span>
                </div>

                {/* Answer */}
                {openIndex === index && (
                  <p className="mt-3 text-gray-600">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 text-center text-sm">
        © 2026 Project Play. All rights reserved.
      </footer>
    </main>
  );
}
