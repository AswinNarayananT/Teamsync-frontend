const Footer = () => {
    return (
      <footer className="bg-[#f2f2f2] px-8 lg:px-32 flex flex-col items-center">
        <div className="w-full max-w-7xl py-16 flex flex-col gap-12">
          {/* Top Section */}
          <div className="flex flex-wrap gap-8 justify-between w-full">
            {/* Left Section */}
            <div className="flex flex-col gap-8">
              {/* Logo */}
              <img className="w-10 h-10" src="logo-placeholder-png0.png" alt="Logo" />
  
              {/* Description */}
              <p className="text-[#6b7280] text-base leading-6">
                Making project management simple and efficient
                <br />
                for teams of all sizes.
              </p>
  
              {/* Social Icons */}
              <div className="flex gap-6 text-[#9ca3af] text-xl">
                <span className="cursor-pointer"></span>
                <span className="cursor-pointer"></span>
                <span className="cursor-pointer"></span>
                <span className="cursor-pointer"></span>
              </div>
            </div>
  
            {/* Links Section */}
            <div className="flex flex-wrap gap-8">
              {/* Solutions */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[#9ca3af] uppercase text-sm font-semibold tracking-wide">
                  Solutions
                </h4>
                <ul className="text-[#6b7280] text-base leading-6 space-y-2">
                  <li>Marketing</li>
                  <li>Development</li>
                  <li>Design</li>
                </ul>
              </div>
  
              {/* Support */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[#9ca3af] uppercase text-sm font-semibold tracking-wide">
                  Support
                </h4>
                <ul className="text-[#6b7280] text-base leading-6 space-y-2">
                  <li>Help Center</li>
                  <li>Guides</li>
                  <li>API Status</li>
                </ul>
              </div>
  
              {/* Company */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[#9ca3af] uppercase text-sm font-semibold tracking-wide">
                  Company
                </h4>
                <ul className="text-[#6b7280] text-base leading-6 space-y-2">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                </ul>
              </div>
  
              {/* Legal */}
              <div className="flex flex-col gap-4">
                <h4 className="text-[#9ca3af] uppercase text-sm font-semibold tracking-wide">
                  Legal
                </h4>
                <ul className="text-[#6b7280] text-base leading-6 space-y-2">
                  <li>Privacy</li>
                  <li>Terms</li>
                </ul>
              </div>
            </div>
          </div>
  
          {/* Bottom Section */}
          <div className="w-full border-t border-[#e5e7eb] pt-8 flex justify-center">
            <p className="text-[#9ca3af] text-center text-base">
              © 2024 Your Company, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  