export default function Button({ children, onClick = () => {} }) {
  return (
    <button
      className="bg-red-600 my-2 p-1 px-3 rounded hover:bg-red-500"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
