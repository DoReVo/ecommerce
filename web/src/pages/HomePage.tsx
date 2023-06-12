import Button from "../components/Button";

function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-4">Homepage</h1>

      <div className="flex flex-row-reverse">
        <Button className="text-xs">
          <div className="i-carbon-add"></div>
          Add Products
          </Button>
      </div>
    </div>
  );
}

export default HomePage;
