import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <div>
        <Image
          src="/Images/logo2.png" // from public folder
          alt="Beautiful background"
          width={100}
          height={80}

        />
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default Navbar;
