import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";

const SwappersDescription = ({ price }: { price: number }) => {
  const [sliderValue, setSliderValue] = useState<number[]>([1]);
  const [adjustedPrice, setAdjustedPrice] = useState<number>(price);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const percentageIncrease = value[0] / 100;
    const newPrice = price * (1 + percentageIncrease);
    setAdjustedPrice(newPrice);
  };

  useEffect(() => {
    console.log("Price Prop:", price); // Debugging
    const percentageIncrease = sliderValue[0] / 100;
    const newPrice = price * (1 + percentageIncrease);
    setAdjustedPrice(newPrice);
  }, [price, sliderValue]);

  const formattedPrice = typeof adjustedPrice === 'number' && !isNaN(adjustedPrice)
    ? adjustedPrice.toFixed(2)
    : "Invalid Price";

  return (
    <div className="text-white bg-red-600 rounded-xl w-1/2 font-normal text-[14px]">
      <Slider
        value={sliderValue}
        onValueChange={handleSliderChange}
        max={30}
        step={1}
      />
      <div className="mt-2">
        {sliderValue[0]}% = ${formattedPrice}
      </div>
    </div>
  );
};

export default SwappersDescription;
