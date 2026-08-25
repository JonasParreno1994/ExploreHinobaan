import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { FormError } from '@/components/admin/form-error';
import { StatusBadge } from '@/components/admin/status-badge';
import { LocationPicker } from '@/components/map/location-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Ban, Building2, CheckCircle2, ExternalLink, FileCheck2, FileText, MapPin, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import { type Enterprise, type EnterpriseDocument } from './index';

type ConfirmAction = 'approve' | 'suspend' | 'reactivate' | null;

export default function ShowEnterprise({ enterprise }: { enterprise: Enterprise }) {
    const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
    const [rejectionOpen, setRejectionOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<EnterpriseDocument | null>(null);
    const rejectionForm = useForm({ rejection_reason: enterprise.rejection_reason ?? '' });
    const documentForm = useForm({ verification_status: 'verified', remarks: '' });
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Enterprises', href: '/admin/enterprises' },
        { title: enterprise.business_name, href: `/admin/enterprises/${enterprise.id}` },
    ];

    const actionDetails = {
        approve: {
            title: 'Approve enterprise?',
            description: 'This records you and the current time as the approving administrator.',
            label: 'Approve enterprise',
            route: 'admin.enterprises.approve',
        },
        suspend: {
            title: 'Suspend enterprise?',
            description: 'The enterprise will remain recorded but will no longer be approved for active operation.',
            label: 'Suspend enterprise',
            route: 'admin.enterprises.suspend',
        },
        reactivate: {
            title: 'Reactivate enterprise?',
            description: 'The enterprise will return to approved status.',
            label: 'Reactivate enterprise',
            route: 'admin.enterprises.reactivate',
        },
    } as const;

    function runConfirmedAction(): void {
        if (!confirmAction) return;
        router.patch(route(actionDetails[confirmAction].route, enterprise.id), {}, { onFinish: () => setConfirmAction(null) });
    }

    function reject(): void {
        rejectionForm.patch(route('admin.enterprises.reject', enterprise.id), { onSuccess: () => setRejectionOpen(false) });
    }

    function reviewDocument(): void {
        if (!selectedDocument) return;
        documentForm.patch(route('admin.enterprises.documents.verify', [enterprise.id, selectedDocument.id]), {
            onSuccess: () => {
                setSelectedDocument(null);
                documentForm.reset();
            },
        });
    }

    const hasCoordinates = enterprise.latitude !== null && enterprise.longitude !== null;
    const details = confirmAction ? actionDetails[confirmAction] : null;

    return (
        <AdminLayout title="Enterprise Application" breadcrumbs={breadcrumbs}>
            <Head title={enterprise.business_name} />
            <div className="mx-auto grid w-full max-w-6xl gap-6">
                <Card className="overflow-hidden">
                    {enterprise.cover_image_url && <img src={enterprise.cover_image_url} alt="" className="max-h-80 w-full object-cover" />}
                    <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                            {enterprise.logo_url ? (
                                <img
                                    src={enterprise.logo_url}
                                    alt={`${enterprise.business_name} logo`}
                                    className="size-20 rounded-xl border object-cover"
                                />
                            ) : (
                                <span className="bg-muted flex size-20 items-center justify-center rounded-xl">
                                    <Building2 className="text-muted-foreground size-9" />
                                </span>
                            )}
                            <div className="grid gap-2">
                                <CardTitle className="text-2xl">{enterprise.business_name}</CardTitle>
                                <div className="flex flex-wrap gap-2">
                                    <StatusBadge status={enterprise.application_status} />
                                    <Badge variant="outline">{enterprise.enterprise_type.name}</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {enterprise.application_status !== 'approved' && enterprise.application_status !== 'suspended' && (
                                <Button className="bg-emerald-700" onClick={() => setConfirmAction('approve')}>
                                    <CheckCircle2 />
                                    Approve
                                </Button>
                            )}
                            {enterprise.application_status !== 'rejected' && enterprise.application_status !== 'suspended' && (
                                <Button variant="destructive" onClick={() => setRejectionOpen(true)}>
                                    <XCircle />
                                    Reject
                                </Button>
                            )}
                            {enterprise.application_status === 'approved' && (
                                <Button variant="outline" onClick={() => setConfirmAction('suspend')}>
                                    <Ban />
                                    Suspend
                                </Button>
                            )}
                            {enterprise.application_status === 'suspended' && (
                                <Button className="bg-emerald-700" onClick={() => setConfirmAction('reactivate')}>
                                    <RotateCcw />
                                    Reactivate
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <section className="grid gap-4 rounded-xl border p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-muted-foreground">Contact person</p>
                                <p className="font-medium">{enterprise.contact_person}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium break-all">{enterprise.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="font-medium">{enterprise.phone}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">License number</p>
                                <p className="font-medium">{enterprise.license_number ?? 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Barangay</p>
                                <p className="font-medium">{enterprise.barangay.name}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-muted-foreground">Address</p>
                                <p className="font-medium">{enterprise.address}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Account</p>
                                <p className="font-medium">{enterprise.user?.name ?? 'Not linked'}</p>
                            </div>
                        </section>
                        {enterprise.description && (
                            <section>
                                <h3 className="mb-2 font-semibold">Description</h3>
                                <p className="text-muted-foreground leading-7 whitespace-pre-wrap">{enterprise.description}</p>
                            </section>
                        )}
                        <div className="flex flex-wrap gap-3">
                            {enterprise.website && (
                                <Button variant="outline" asChild>
                                    <a href={enterprise.website} target="_blank" rel="noreferrer">
                                        <ExternalLink />
                                        Visit website
                                    </a>
                                </Button>
                            )}
                        </div>
                        {enterprise.application_status === 'approved' && (
                            <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
                                <p className="font-semibold text-emerald-800 dark:text-emerald-200">Approval information</p>
                                <p className="text-emerald-700 dark:text-emerald-300">
                                    Approved {enterprise.approved_at ? new Date(enterprise.approved_at).toLocaleString() : ''} by{' '}
                                    {enterprise.approver?.name ?? 'Unknown administrator'}.
                                </p>
                            </section>
                        )}
                        {enterprise.rejection_reason && (
                            <section className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm dark:border-red-900 dark:bg-red-950/30">
                                <p className="font-semibold text-red-800 dark:text-red-200">Rejection reason</p>
                                <p className="whitespace-pre-wrap text-red-700 dark:text-red-300">{enterprise.rejection_reason}</p>
                            </section>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText />
                            Documents
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                        {enterprise.documents?.length ? (
                            enterprise.documents.map((document) => (
                                <article key={document.id} className="grid gap-4 rounded-xl border p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                                    <div className="grid gap-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-semibold">{document.document_type}</p>
                                            <Badge variant="outline">{document.verification_status}</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            Number: {document.document_number ?? 'Not provided'} · Expires:{' '}
                                            {document.expiration_date ?? 'Not specified'}
                                        </p>
                                        {document.remarks && <p className="text-muted-foreground text-sm">Remarks: {document.remarks}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={document.file_url} target="_blank" rel="noreferrer">
                                                <ExternalLink />
                                                Open file
                                            </a>
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setSelectedDocument(document);
                                                documentForm.setData({
                                                    verification_status: document.verification_status === 'rejected' ? 'rejected' : 'verified',
                                                    remarks: document.remarks ?? '',
                                                });
                                            }}
                                        >
                                            <FileCheck2 />
                                            Review
                                        </Button>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="text-muted-foreground py-10 text-center">No documents submitted.</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin />
                            Map location
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {hasCoordinates ? (
                            <LocationPicker
                                latitude={enterprise.latitude ?? ''}
                                longitude={enterprise.longitude ?? ''}
                                onChange={() => undefined}
                                disabled
                            />
                        ) : (
                            <div className="text-muted-foreground rounded-xl border border-dashed py-12 text-center">
                                No verified map coordinates available.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={!!details}
                onOpenChange={(open) => !open && setConfirmAction(null)}
                title={details?.title ?? ''}
                description={details?.description ?? ''}
                confirmLabel={details?.label ?? 'Confirm'}
                onConfirm={runConfirmedAction}
            />

            <Dialog open={rejectionOpen} onOpenChange={setRejectionOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject enterprise application</DialogTitle>
                        <DialogDescription>Provide the reason that will remain attached to this application.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="rejection_reason">Rejection reason</Label>
                        <textarea
                            id="rejection_reason"
                            rows={5}
                            value={rejectionForm.data.rejection_reason}
                            onChange={(event) => rejectionForm.setData('rejection_reason', event.target.value)}
                            className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                        />
                        <FormError message={rejectionForm.errors.rejection_reason} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectionOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" disabled={rejectionForm.processing} onClick={reject}>
                            Reject application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review {selectedDocument?.document_type}</DialogTitle>
                        <DialogDescription>Verify or reject this submitted document.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="verification_status">Decision</Label>
                            <select
                                id="verification_status"
                                value={documentForm.data.verification_status}
                                onChange={(event) => documentForm.setData('verification_status', event.target.value)}
                                className="bg-background h-10 rounded-md border px-3 text-sm"
                            >
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <FormError message={documentForm.errors.verification_status} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="remarks">Remarks {documentForm.data.verification_status === 'rejected' && '(required)'}</Label>
                            <textarea
                                id="remarks"
                                rows={4}
                                value={documentForm.data.remarks}
                                onChange={(event) => documentForm.setData('remarks', event.target.value)}
                                className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                            />
                            <FormError message={documentForm.errors.remarks} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                            Cancel
                        </Button>
                        <Button disabled={documentForm.processing} onClick={reviewDocument}>
                            Save review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
