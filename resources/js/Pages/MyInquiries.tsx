import Layout from '@/Layouts/Layout';
import type { Inquiry } from '@/Types/types';

export default function MyInquiries({ inquiries }: { inquiries: Inquiry[] }) {
  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Inquiries</h1>
        {inquiries.length === 0 ? (
          <p>You have no inquiries yet.</p> // Show message when there are no inquiries
        ) : (
          <ul className="space-y-4">
            {inquiries.map((inquiry) => (
              <li key={inquiry.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold">{inquiry.item_name}</h2>
                <p className="text-gray-600">Created at: {new Date(inquiry.created_at).toLocaleString()}</p>
                {/* <p className="text-gray-800 mt-2">{inquiry.item_description}</p> */}
              </li> // Display each inquiry in a styled card
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
