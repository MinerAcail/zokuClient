import { SwatchBook } from "lucide-react";
import srcimage from "../../../../assets/images/b1.jpg";
import { ItemLayout } from "../../useAble/ItemLayout";
import Description from "../../useAble/description";

function Market() {
  const imagePaths = Array.from(
    { length: 23 },
    (_, index) => `../../../../src/assets/images/${index + 1}.jpg`
  );
  return (
    <div>
      <Description text={"Find More And All Items On Zuko Here"} />

      <div
        className="m-5  grid gap-4 
  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {imagePaths.map((imageSrc, index) => (
          <ItemLayout key={index}>
            <img
              src={imageSrc}
              alt={`Image ${index + 1}`}
              className="rounded-xl object-cover"
            />
          </ItemLayout>
        ))}
      </div>
    </div>
  );
}

export default Market;
