import { Link } from "@tanstack/react-router";

const content_arry = [
  {
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "1.1 Personal Information You Provide",
        details: [
          "Full name",
          "Email address",
          "Phone number",
          "Password (encrypted)",
          "Billing and payment information",
          "Booking details (cinemas, hotels, studio sections)",
          "Delivery address for food orders",
          "Communication preferences",
        ],
      },
      {
        subtitle: "1.2 Automatically Collected Information",
        details: [
          "Device information (device type, operating system)",
          "IP address",
          "App usage data (pages viewed, features used)",
          "Date and time of access",
          "Location data (if enabled on your device)",
        ],
      },
      {
        subtitle: "1.3 Information from Third Parties",
        details: [
          "Payment processors",
          "Booking partners (cinemas, hotels, studios)",
          "Food vendors and delivery partners",
          "Analytics and marketing service providers",
        ],
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "Create and manage your account",
      "Process bookings and reservations",
      "Facilitate food delivery orders",
      "Process payments and refunds",
      "Communicate booking confirmations, updates, and support messages",
      "Improve App functionality and user experience",
      "Send promotional offers and notifications (with your consent)",
      "Ensure security, prevent fraud, and comply with legal obligations",
    ],
  },
  {
    title: "3. Sharing of Information",
    content: [
      "We do not sell your personal data. We may share information only as necessary with:",
      "Service Providers: Payment processors, hosting providers, analytics tools",
      "Business Partners: Cinemas, hotels, studios, food vendors, and delivery partners to fulfill your orders",
      "Legal Authorities: When required by law or to protect rights, safety, and security",
      "Business Transfers: In case of a merger, acquisition, or sale of assets",
    ],
  },
  {
    title: "4. Payments and Financial Data",
    content: [
      "All payments are processed through secure third-party payment gateways. Deepend does not store your full card details.",
      "Payment providers handle your information according to their own privacy policies.",
    ],
  },
  {
    title: "5. Cookies and Tracking Technologies",
    content: [
      "We may use cookies and similar technologies to:",
      "Remember user preferences",
      "Analyze usage and performance",
      "Improve services and marketing effectiveness",
      "You can manage cookie preferences through your device or browser settings.",
    ],
  },
  {
    title: "6. Data Security",
    content: [
      "We implement reasonable technical and organizational security measures to protect your personal information from unauthorized access, loss, or misuse. However, no system is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "7. Data Retention",
    content: [
      "We retain personal data only as long as necessary to:",
      "Provide services",
      "Fulfill legal and accounting obligations",
      "Resolve disputes and enforce agreements",
      "When data is no longer needed, it is securely deleted or anonymized.",
    ],
  },
  {
    title: "8. Your Rights and Choices",
    content: [
      "Depending on your location, you may have the right to:",
      "Access your personal data",
      "Correct or update information",
      "Request deletion of your data",
      "Withdraw consent for marketing communications",
      "Request a copy of your data",
      "You can exercise these rights by contacting us at the email below.",
    ],
  },
  {
    title: "9. Children’s Privacy",
    content: [
      "The App is not intended for children under the age of 13 (or applicable minimum age in your jurisdiction). We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "10. Third-Party Links",
    content: [
      "The App may contain links to third-party websites or services. We are not responsible for their privacy practices, and we encourage you to review their policies.",
    ],
  },
  {
    title: "11. Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time. Any changes will be posted in the App with an updated effective date. Continued use of the App constitutes acceptance of the revised policy.",
    ],
  },
  {
    title: "12. Contact Us",
    content: [
      "If you have questions or concerns about this Privacy Policy or our data practices, please contact us:",
      "Deepend Entertainment",
      "Email: prince31156@yahoo.com",
      "Address: Ogun state, Nigeria",
    ],
  },
];
export default function index() {
  return (
    <div className="">
      <div className="h-20 z-20 bg-base-300/20 backdrop-blur-sm absolute w-full top-0">
        <div className="size-full flex container mx-auto items-center px-4 ">
          <img
            src="https://deependapp.com.ng/assets/images/deep.png"
            className="h-14"
            alt=""
          />
          <Link to="/auth/login" className="btn btn-primary ml-auto">
            Login
          </Link>
        </div>
      </div>
      <div className="h-[320px] bg-base-300   relative isolate">
        <img
          src="bg.png"
          className="absolute inset-0  -z-10 h-full w-full"
          alt=""
        />

        <div
          className="container px-4 flex items-center mx-auto   h-full"
          style={{}}
        >
          {/*<img
            src="https://deependapp.com.ng/assets/images/deep.png"
            alt=""
            className="md:h-[120px] h-[90px]"
          />*/}
          <div className="mr-auto font-bold text-5xl">Privacy Policy</div>
        </div>
      </div>
      <div className="bg-white text-black py-12">
        <div className="container px-4 mx-auto">
          <div className="">
            {content_arry.map((section, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
                {Array.isArray(section.content) ? (
                  <ul>
                    {section.content.map((item, itemIndex) =>
                      typeof item === "string" ? (
                        <li key={itemIndex}>{item}</li>
                      ) : (
                        <div key={itemIndex} className="my-4">
                          {item.subtitle && (
                            <h3 className="font-semibold text-lg">
                              {item.subtitle}
                            </h3>
                          )}
                          {item.details && (
                            <ul className="list-disc ml-2 space-y-2 list-inside">
                              {item.details.map((detail, detailIndex) => (
                                <li key={detailIndex}>{detail}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ),
                    )}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
