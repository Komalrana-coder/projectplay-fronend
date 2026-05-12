"use client";

export default function CancellationRefundPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Cancellation & Refund Policy
          </h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            At Project Play, we strive to provide a fair and transparent experience
            for all users. Please review our cancellation and refund policy carefully
            before making any bookings.
          </p>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Cancellation Policy
          </h2>

          <ul className="list-disc pl-5 space-y-3 text-gray-700">
            <li>
              Only the <span className="font-semibold">creator of the booking</span>{" "}
              can cancel or modify it.
            </li>
            <li>
              Cancellations or modifications are allowed only up to{" "}
              <span className="font-semibold">
                24 hours before the game start time
              </span>.
            </li>
            <li>
              Cancellations or modifications are not allowed within 24 hours of
              the game start time.
            </li>
            <li>
              <span className="font-semibold">Partial cancellations</span> (for
              individual players within a booking) are not supported.
            </li>
            <li>
              If a game is cancelled by the admin, creator, or system (due to
              technical reasons or low player count), all affected users will
              automatically receive a refund in Play Coins.
            </li>
          </ul>
        </div>

        {/* Refund Policy */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Refund Policy
          </h2>

          <p className="text-gray-700 mb-4">
            All payments for bookings on Project Play are collected in advance.
            Refunds are processed instantly in the form of{" "}
            <span className="font-semibold">Play Coins</span> when a booking is
            cancelled — either by the user (within the allowed time window) or by
            the admin/creator.
          </p>

          <ul className="list-disc pl-5 space-y-3 text-gray-700">
            <li>
              <span className="font-semibold">Refund Processing Time:</span>{" "}
              Refunds are issued instantly at the time of cancellation.
            </li>
            <li>
              <span className="font-semibold">Refund Mode:</span> All refunds are
              credited as Play Coins to the user's account. Play Coins can be used
              for future bookings but cannot be withdrawn or converted to real money.
            </li>
            <li>
              Refunds are applicable only if the cancellation occurs at least 24
              hours before the game start time.
            </li>
            <li>
              No refunds are issued once the game has started or if the user fails
              to attend (no-show).
            </li>
            <li>
              If a game is cancelled by the admin, creator, or system, all affected
              users will automatically receive a full refund in Play Coins.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}