import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Gearyo",
  description: "Terms and conditions for using the Gearyo platform",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="text-sm text-gray-600 mb-8">Last Updated: November 20, 2024</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Gearyo (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the Gearyo website, mobile application, and services (collectively, the &quot;Platform&quot;). By accessing or using our Platform, you agree to be bound by these Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>&quot;Platform&quot; refers to the Gearyo website, mobile application, and related services</li>
          <li>&quot;Renter&quot; refers to any user who rents gear through our Platform</li>
          <li>&quot;Rental Shop&quot; refers to any business that lists gear for rent on our Platform</li>
          <li>&quot;Gear&quot; refers to any outdoor equipment or items available for rent through our Platform</li>
          <li>&quot;Rental Period&quot; refers to the duration for which gear is rented</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
        <h3 className="text-xl font-medium mb-3">3.1 User Accounts</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>You must be at least 18 years old to create an account</li>
          <li>You must provide accurate, current, and complete information</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials</li>
          <li>You must notify us immediately of any unauthorized use of your account</li>
        </ul>

        <h3 className="text-xl font-medium mb-3">3.2 Rental Shop Accounts</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Rental shops must provide valid business documentation</li>
          <li>Rental shops must maintain current business licenses and insurance</li>
          <li>Rental shops are responsible for the accuracy of their listings</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Platform Rules and Guidelines</h2>
        <h3 className="text-xl font-medium mb-3">4.1 General Conduct</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Users must not engage in fraudulent, abusive, or illegal activities</li>
          <li>Users must not interfere with the Platform&apos;s operation</li>
          <li>Users must not attempt to access restricted areas of the Platform</li>
        </ul>

        <h3 className="text-xl font-medium mb-3">4.2 Prohibited Items</h3>
        <p className="mb-2">The following items may not be listed for rent:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Damaged or unsafe equipment</li>
          <li>Items prohibited by law</li>
          <li>Personal protective equipment that requires professional fitting</li>
          <li>Modified equipment that doesn&apos;t meet manufacturer specifications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
        <p className="mb-4">For questions about these Terms, contact us at:</p>
        <div className="space-y-2">
          <p>Email: alex@gearyo.com</p>
          <p>Address: [Company Address]</p>
          <p>Phone: +44 7401 095288</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Acceptance</h2>
        <p>
          By using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
        </p>
      </section>
    </div>
  );
}
