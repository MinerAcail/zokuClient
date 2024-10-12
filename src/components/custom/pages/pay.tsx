
import { usePaystackPayment } from 'react-paystack';

const config = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com",
    amount: 200,
    publicKey: 'pk_test_2d6e36e8ec438d929401f1c4f2f097eeb268fcd1',
    currency: 'GHS',
    
};

const PaystackHookExample = () => {
    const initializePayment = usePaystackPayment(config);

    const handlePayment = () => {
        initializePayment({
            onSuccess: (reference) => {
                console.log(reference);
            },
            onClose: () => {
                console.log('closed');
            }
        });
    };

    return (
        <div>
            <button onClick={handlePayment}>Pay with Paystack</button>
        </div>
    );
};

export default function Pay() {
    return (
        <div className="App">
            <PaystackHookExample />
        </div>
    );
}
