import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
			<div className="max-w-4xl w-full rounded-2xl shadow-xl p-8 md:p-12 my-8 bg-gray-800 border border-gray-700">
				<div className="mb-10">
					<h1 className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500 mb-4">
						Welcome to EchoCloud
					</h1>
					<p className="text-center text-base text-gray-300 max-w-xl mx-auto">
						Your digital time capsule for creating and sharing
						memories.
					</p>
				</div>

				<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
					<div className="flex flex-col items-center p-6 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all">
						<p className="text-center text-lg text-gray-300 mb-6">
							Join us in preserving your memories for a lifetime.
						</p>
						<Link
							href="/register"
							className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all text-center font-medium w-full md:w-auto"
						>
							Get Started
						</Link>
					</div>

					<div className="flex flex-col items-center p-6 border border-gray-700 rounded-xl bg-gray-800 hover:bg-gray-700 hover:shadow-md transition-all">
						<p className="text-center text-lg text-gray-300 mb-6">
							Already have an account?
						</p>
						<Link
							href="/login"
							className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:-translate-y-1 transition-all text-center font-medium w-full md:w-auto"
						>
							Login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
