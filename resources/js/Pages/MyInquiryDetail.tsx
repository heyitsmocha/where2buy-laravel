import Layout from "@/Layouts/Layout";
import type { Inquiry } from "@/Types/types";

import { Card } from "@/Components/ui/card";
import MapComponent from "@/Components/Map/MapComponent";

export default function MyInquiryDetail({ inquiry }: { inquiry: { data: Inquiry } }) {
  // console.log('Inquiry details:', inquiry);

  const handleAnswerClick = (answerId: number) => () => {
    console.log('Clicked answer with ID:', answerId);
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">{inquiry.data.item_name}</h1>
      <p className="text-gray-600">You asked at: {new Date(inquiry.data.created_at).toLocaleString()}</p>
      <Card className="p-4">
        {/* <p className="text-gray-800 mt-2">{inquiry.item.description}</p> */}
        <MapComponent
          initialCoordinates={[inquiry.data.latitude, inquiry.data.longitude]}
          initialZoom={13}
          markers={inquiry.data.answers}
        />
      </Card>
        <h2 className="text-xl font-semibold mt-6 mb-2">Answers</h2>
        <Card className="p-4">
        {inquiry.data.answers.length === 0 ? (
          <p>No answers yet.</p>
        ) : (
          <ul className="space-y-4">
            {inquiry.data.answers.map((answer) => (
              <li key={answer.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div onClick={handleAnswerClick(answer.id)}>
                  <h3 className="text-lg font-medium">{answer.store_name}</h3>
                  <p className="text-gray-600">Location: [{answer.latitude}, {answer.longitude}]</p>
                  {answer.store_address && <p className="text-gray-800 mt-1">{answer.store_address}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Layout>
  );
};
