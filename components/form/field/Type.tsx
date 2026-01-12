export const TypeInput: React.FC<any> = () => {
  return (
    <>
      <input
        id="name"
        name="name"
        placeholder="Type product name"
        required
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
      />
    </>
  );
};
