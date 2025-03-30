import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
export default async function Home() {
	const users = await prisma.user.findMany();
	console.log("🚀 ~ Home ~ users:", users)
	return (
		<div>
			<Button>click here</Button>
		</div>
	);
}