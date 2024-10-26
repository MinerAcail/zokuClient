import { toast } from "sonner";

interface CartToastProps {
  message: string;
  description?: string;
  onYes?: () => void; // Function to handle the "Yes" action
  onNo?: () => void; // Function to handle the "No" action
}

export function CartToast({
  message,
  description,
  onYes,
  onNo,
}: CartToastProps) {
  toast.custom(
    () => (
      <div className="flex flex-col p-4 rounded-xl bg-white shadow-lg max-w-sm">
        <div className="flex flex-col items-center space-y-4">
          <span className="text-lg font-semibold text-gray-800">{message}</span>
          <span className="text-sm text-gray-500 text-center">
            {description}
          </span>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => {
              onYes && onYes(); // Call onYes function
              // toast.dismiss(); // Close the toast
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
          >
            Yes
          </button>
          <button
            onClick={() => {
              onNo && onNo(); // Call onNo function
              // toast.dismiss(); // Close the toast
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
          >
            No
          </button>
        </div>
      </div>
    ),
    { duration: 3000 } // Toast will auto-dismiss after 3 seconds
  );
}
