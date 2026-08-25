import PartnerLayout from '@/components/tourism-enterprise/partner-layout';
import { Head } from '@inertiajs/react';
import { CalendarDays, ExternalLink, FileText } from 'lucide-react';

interface Document {
    id: number;
    document_type: string;
    document_number: string | null;
    file_url: string;
    expiration_date: string | null;
    verification_status: string;
    remarks: string | null;
    enterprise: { business_name: string };
}

export default function DocumentIndex({ documents }: { documents: Document[] }) {
    return (
        <PartnerLayout>
            <Head title="Registration Documents" />
            <p className="text-xs font-bold tracking-widest text-[#F97316] uppercase">Compliance records</p>
            <h1 className="mt-2 text-3xl font-extrabold">Registration Documents</h1>
            <p className="mt-2 text-[#64748B]">Files submitted during registration and their verification status.</p>
            <div className="mt-7 overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
                <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 bg-[#FFF3E6] px-6 py-4 text-xs font-bold text-[#64748B] uppercase md:grid">
                    <span>Document</span>
                    <span>Enterprise</span>
                    <span>Expiration</span>
                    <span>Status</span>
                    <span>File</span>
                </div>
                <div className="divide-y divide-orange-100">
                    {documents.map((document) => (
                        <article key={document.id} className="grid gap-4 px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center">
                            <div className="flex gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                                    <FileText className="size-5 text-[#F97316]" />
                                </span>
                                <div>
                                    <strong className="block capitalize">{document.document_type.replaceAll('_', ' ')}</strong>
                                    <small className="text-[#64748B]">{document.document_number || 'No document number'}</small>
                                </div>
                            </div>
                            <span className="text-sm">{document.enterprise.business_name}</span>
                            <span className="flex items-center gap-2 text-sm text-[#64748B]">
                                <CalendarDays className="size-4" />
                                {document.expiration_date || 'No expiration'}
                            </span>
                            <div>
                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${document.verification_status === 'verified' ? 'bg-teal-50 text-[#0F766E]' : document.verification_status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}
                                >
                                    {document.verification_status}
                                </span>
                                {document.remarks && <p className="mt-2 text-xs text-[#64748B]">{document.remarks}</p>}
                            </div>
                            <a
                                href={document.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-bold text-[#F97316]"
                            >
                                View <ExternalLink className="size-4" />
                            </a>
                        </article>
                    ))}
                    {documents.length === 0 && <div className="p-12 text-center text-[#64748B]">No registration documents were found.</div>}
                </div>
            </div>
        </PartnerLayout>
    );
}
