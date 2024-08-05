import BoxLayout from "../../useAble/boxLayout";

function AddedFavourite() {
  // const imagePaths = Array.from(
  //   { length: 23 },
  //   (_, index) => `../../../../src/assets/images/${index + 1}.jpg`
  // );
  return (
    <div>
      <div
        className="m-5  grid gap-4 
  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <BoxLayout />
        <BoxLayout />
        <BoxLayout />
        <BoxLayout />
        <BoxLayout />
      </div>
    </div>
  );
}

export default AddedFavourite;
