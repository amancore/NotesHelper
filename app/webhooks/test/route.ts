import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
	const SIGNING_SECRET = process.env.SIGNING_SECRET;

	if (!SIGNING_SECRET) {
		throw new Error(
			"Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env"
		);
	}
	const wh = new Webhook(SIGNING_SECRET);

	// Get headers
	const headerPayload = await headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error: Missing Svix headers", {
			status: 400,
		});
	}

	// Get body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	let evt: WebhookEvent;

	// Verify payload with headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error: Could not verify webhook:", err);
		return new Response("Error: Verification error", {
			status: 400,
		});
	}
  // ADD THIS CODE
  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, image_url, last_name } = evt.data
    console.log("🚀 ~ POST ~ id:", id)
    console.log("🚀 ~ POST ~ last_name:", last_name)
    console.log("🚀 ~ POST ~ image_url:", image_url)
    console.log("🚀 ~ POST ~ first_name:", first_name)
    console.log("🚀 ~ POST ~ email_addresses:", email_addresses)
		try {
			
        const newEvent = await prisma.user.create({
        data: {
          id: id,
          email: email_addresses[0].email_address,
          firstName: first_name,
          lastName: last_name,
          profileImage: image_url,
        },
      })
      return new Response(JSON.stringify(newEvent), {
        status: 201,
      })
    } catch (err) {
      console.error('Error: Failed to store event in the database:', err)
      return new Response('Error: Failed to store event in the database', {
        status: 500,
      });
    }
  }
	return new Response("Webhook received", { status: 200 });
}
