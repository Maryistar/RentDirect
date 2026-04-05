import PrivacyContent from "../components/legal/PrivacyContent";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Política de Privacidad
        </h1>

        <div className="text-gray-700 text-sm leading-relaxed">
          <PrivacyContent />
        </div>

      </div>
    </div>
  );
}