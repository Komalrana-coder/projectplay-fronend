"use client";

import Image from "next/image";
import { useState } from "react";

type Equipment = {
  id: string;
  name: string;
  description: string;
  qty: number;
  selected: boolean;
};

type Props = {
  onClose: () => void;
};

type PaymentMethod = "coins" | "upi" | "both";

export default function PadelBookingModal({ onClose }: Props){
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: "r1", name: "Racket", description: "Lorem ipsum text here", qty: 0, selected: false },
    { id: "r2", name: "Racket", description: "Lorem ipsum text here", qty: 0, selected: false },
    { id: "b1", name: "Ball", description: "Lorem ipsum text here", qty: 0, selected: false },
  ]);

  const [payment, setPayment] = useState<PaymentMethod>("coins");

  const updateQty = (id: string, delta: number) => {
    setEquipment((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: Math.max(0, item.qty + delta),
              selected: item.qty + delta > 0,
            }
          : item
      )
    );
  };

  const toggleSelect = (id: string) => {
    setEquipment((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  return (

     <div
  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  onClick={onClose}
>
  
    
      <div className="w-full max-w-md bg-white rounded-t-2xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}>

        {/* Header Image */}
        <div className="relative h-44 w-full">
          <Image
            src="/image12.svg"
            alt="Padel"
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">

          {/* Title */}
          <h2 className="text-lg font-semibold">Padel Game</h2>
          <p className="text-sm text-gray-500 mb-3">
            Sector 24, Chandigarh
          </p>

          {/* Equipment */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Add Equipment</h3>

            {equipment.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.id)}
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 border rounded"
                    onClick={() => updateQty(item.id, -1)}
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    className="w-7 h-7 border rounded"
                    onClick={() => updateQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">
              Select Payment Method
            </h3>

            <p className="text-xs text-gray-500 mb-2">
              Available Play Coins: 3500
            </p>

            <div className="space-y-2">
              {[
                { id: "coins", label: "Play Coins" },
                { id: "upi", label: "UPI / Card" },
                { id: "both", label: "Both" },
              ].map((method) => (
                <label
                  key={method.id}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <div>
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={payment === method.id}
                      onChange={() =>
                        setPayment(method.id as PaymentMethod)
                      }
                      className="mr-2"
                    />
                    {method.label}
                  </div>
                  <span>💰</span>
                </label>
              ))}
            </div>
          </div>

          {/* Collapse */}
          <details className="mb-4">
            <summary className="cursor-pointer text-sm font-medium">
              Cancellation Policy
            </summary>
            <p className="text-xs text-gray-500 mt-2">
              Free cancellation up to 2 hours before the game.
            </p>
          </details>

          {/* CTA */}
          <button className="w-full bg-[#0f2a44] text-white py-3 rounded-xl font-medium">
            Pay ₹500
          </button>
        </div>
      </div>
    </div>
 



  );
}