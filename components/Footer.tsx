export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 py-4 text-white">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} KIN. All rights reserved.</p>
      </div>
    </footer>
  );
}
