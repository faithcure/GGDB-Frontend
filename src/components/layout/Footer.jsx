// src/components/layout/Footer.jsx
import React from "react";
import {
  FaTiktok,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa6";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-00 px-6 py-10 text-sm w-full">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 items-center">
        {/* Sosyal + Uygulama kutuları */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Sosyal medya kutusu */}
          <div className="border border-gray-700 rounded-md p-4 w-72 text-center">
            <p className="text-white font-semibold mb-3">
              Follow GGDB on social
            </p>
            <div className="flex justify-center gap-4 text-white text-xl">
              <FaTiktok />
              <FaInstagram />
              <FaXTwitter />
              <FaYoutube />
              <FaFacebook />
            </div>
          </div>

          {/* Uygulama kutusu */}
          <div className="border border-gray-700 rounded-md p-4 w-72 text-center">
            <p className="text-white font-semibold">Get the GGDB app</p>
            <p className="text-sm mt-1 text-gray-400">
              For Android and iOS
            </p>

          </div>
        </div>

        {/* Link grubu */}
        <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
          {[
            "Help",
            "Site Index",
            "GGDB Pro",
            "API",
            "Press Room",
            "Advertising",
            "Jobs",
            "Conditions of Use",
            "Privacy Policy",
            "Your Ads Privacy Choices",
          ].map((item, i) => (
            <a
              key={i}
              href="#"
              className="hover:text-teal-400 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Alt bilgi ve logo */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <img
            src="/GGDB_logo.svg"
            alt="GGDB Logo"
            className="h-8 mx-auto mb-2"
          />
          <p className="mb-1 text-white font-semibold">
            The Good game database
          </p>
          <p>© 2020–{currentYear} by GGDB.com, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
