import { PricingClient } from "./PricingClient";
import { Footer } from "@/components/layout/Footer";
import { getBundles } from "@/actions/bundle";
import { PaymentStatusBanner } from "@/components/checkout/PaymentStatusBanner";

export const dynamic = 'force-dynamic';

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const [bundles, params] = await Promise.all([getBundles(), searchParams]);
    const status = params?.collection_status || params?.status;

    return (
        <>
            <PaymentStatusBanner status={status} />
            <PricingClient initialBundles={bundles} footer={<Footer />} />
        </>
    );
}
