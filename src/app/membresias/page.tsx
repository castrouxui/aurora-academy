import { PricingClient } from "./PricingClient";
import { Footer } from "@/components/layout/Footer";
import { getBundles } from "@/actions/bundle";

export const dynamic = 'force-dynamic';

export default async function PricingPage() {
    // Fetch bundles on the server
    const bundles = await getBundles();

    return (
        <PricingClient initialBundles={bundles} footer={<Footer />} />
    );
}
