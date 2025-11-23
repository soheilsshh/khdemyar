import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

export default function SellersLayout({ children }) {
  return (
    <div dir="rtl" className="flex flex-col min-h-screen">
      <div className="">
        <Navbar />
      </div>
      <div className="flex-1">
        {children}
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}