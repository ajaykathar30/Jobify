import React from 'react'

const Footer = () => {
  return (
    // Change 1: Reduced vertical padding (py-8) and margin (mt-8) for mobile
    <footer className="bg-gray-900 text-gray-300 py-8 mt-8 md:py-10 md:mt-10">
      
      {/* Change 2: Changed grid-cols-1 to grid-cols-2. 
          This puts lists side-by-side on mobile instead of stacking vertically. */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">

        {/* Brand - Change 3: Added col-span-2 for mobile.
            The brand text needs full width on mobile to be readable, 
            then it goes back to 1 column on desktop (md:col-span-1). */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-2xl font-semibold text-white">Jobify</h2>
          <p className="mt-2 text-sm pr-4"> {/* Added pr-4 to prevent text hitting edge */}
            Your gateway to better career opportunities. Find your dream job with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors">Home</li>
            <li className="hover:text-white cursor-pointer transition-colors">Browse Jobs</li>
            <li className="hover:text-white cursor-pointer transition-colors">Companies</li>
            <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Career Tips</li>
            <li className="hover:text-white cursor-pointer transition-colors">FAQs</li>
            <li className="hover:text-white cursor-pointer transition-colors">Support</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors">LinkedIn</li>
            <li className="hover:text-white cursor-pointer transition-colors">Twitter</li>
            <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
            <li className="hover:text-white cursor-pointer transition-colors">Facebook</li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Jobify. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer