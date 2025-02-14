import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function Home() {
  return (
    <main className="flex">
      <div className="flex-grow">
        <Header />
      </div>
      <Sidebar />
    </main>
  );
}
