import Link from "next/link";
import { Button } from "./ui/button";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
export default function NavBar() {
	return (
		<div className="border-b">
			<div className="container mx-auto flex items-center justify-between px-4 h-16 ">
				<Link href="/" className="text-xl bold font-black">
					Notes Helper
				</Link>
				<div className="space-x-4 flex items-center gap-4">
					<SignedIn>
						<Link href="/dashboard">
							<Button>Dashboard</Button>
						</Link>
						<UserButton />
					</SignedIn>
					<SignedOut>
						<SignInButton>
							<Button variant="outline">Sign in</Button>
						</SignInButton>
					</SignedOut>
				</div>
			</div>
		</div>
	);
}
