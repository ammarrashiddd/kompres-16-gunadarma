"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CaretDown, SignOut, Gear } from "@phosphor-icons/react";

interface UserMenuProps {
  userName: string;
  userEmail?: string | null;
  userImage?: string | null;
  onLogout: () => void;
  onProfileUpdated?: (updated: { nama: string; avatar?: string | null }) => void;
}

export default function UserMenu({
  userName: initialUserName,
  userEmail,
  userImage: initialUserImage,
  onLogout,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [userAvatar, setUserAvatar] = useState(initialUserImage);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserName(initialUserName);
  }, [initialUserName]);

  useEffect(() => {
    setUserAvatar(initialUserImage);
  }, [initialUserImage]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Trigger Button: Halo, username */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 py-1.5 px-3.5 rounded-full border border-[#dedbd5] bg-white hover:bg-[#f7f7f5] transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-6 h-6 rounded-full object-cover border border-[#e5e3df] shrink-0"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#202123] text-white flex items-center justify-center text-xs font-bold shrink-0">
              {userName.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <span className="text-xs md:text-sm font-semibold text-[#202123] max-w-[140px] truncate">
            Halo, {userName}
          </span>
          <CaretDown
            size={14}
            weight="bold"
            className={`text-[#6f6d69] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-[0_16px_40px_rgba(48,43,38,0.12)] border border-[#dedbd5] z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* User profile header */}
            <div className="px-3 py-2 border-b border-[#f0ede9] mb-1">
              <p className="text-xs font-bold text-[#202123] truncate">{userName}</p>
              {userEmail && (
                <p className="text-[11px] text-[#6f6d69] truncate mt-0.5">{userEmail}</p>
              )}
            </div>

            {/* Edit Profil Link */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-[#202123] rounded-xl hover:bg-[#f7f7f5] transition-colors duration-150 cursor-pointer"
            >
              <Gear size={16} weight="bold" className="text-[#a15d3c]" />
              Edit Profil
            </Link>

            {/* Logout button */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-150 cursor-pointer mt-0.5"
            >
              <SignOut size={16} weight="bold" />
              Keluar (Logout)
            </button>
          </div>
        )}
      </div>
    </>
  );
}
