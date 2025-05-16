import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="bg-neutral-200 p-4 text-center text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200 text-sm">
        <p>
          © 2023 Copyright:
          <a
            className="ml-1 text-neutral-800 dark:text-neutral-400"
            href="https://tw-elements.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TW Elements
          </a>
        </p>
        <p className="mt-1">
          Map data ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="text-blue-600 dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>
          , Imagery ©{" "}
          <a
            href="https://www.mapbox.com/about/maps/"
            className="text-blue-600 dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mapbox
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
