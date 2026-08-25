import { ImageUploader } from '@/components/admin/image-uploader';
import InputError from '@/components/input-error';
import { LocationPicker } from '@/components/map/location-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, FileText, LoaderCircle, MapPin, Plus, Trash2, UserRound } from 'lucide-react';
import { type FormEvent, type ReactNode } from 'react';

interface Option {
    id: number;
    name: string;
}
interface DocumentData {
    document_type: string;
    document_number: string;
    expiration_date: string;
    file: File | null;
}
interface RegistrationData {
    name: string;
    account_email: string;
    account_phone: string;
    password: string;
    password_confirmation: string;
    enterprise_type_id: string;
    barangay_id: string;
    business_name: string;
    contact_person: string;
    business_email: string;
    business_phone: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    website: string;
    license_number: string;
    logo: File | null;
    cover_image: File | null;
    documents: DocumentData[];
    terms: boolean;
}
const emptyDocument = (): DocumentData => ({ document_type: '', document_number: '', expiration_date: '', file: null });

export default function PartnerRegister({ enterpriseTypes, barangays }: { enterpriseTypes: Option[]; barangays: Option[] }) {
    const form = useForm<RegistrationData>({
        name: '',
        account_email: '',
        account_phone: '',
        password: '',
        password_confirmation: '',
        enterprise_type_id: '',
        barangay_id: '',
        business_name: '',
        contact_person: '',
        business_email: '',
        business_phone: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        website: '',
        license_number: '',
        logo: null,
        cover_image: null,
        documents: [emptyDocument()],
        terms: false,
    });
    function submit(event: FormEvent): void {
        event.preventDefault();
        form.post(route('partner.register.store'), { forceFormData: true });
    }
    function updateDocument(index: number, values: Partial<DocumentData>): void {
        form.setData(
            'documents',
            form.data.documents.map((document, documentIndex) => (documentIndex === index ? { ...document, ...values } : document)),
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBF5] text-[#1F2937]">
            <Head title="Register Tourism Enterprise" />
            <header className="sticky top-0 z-[1000] border-b border-orange-100 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5">
                    <Link href={route('partner.login')} className="flex items-center gap-2 text-sm font-bold text-[#0F766E]">
                        <ArrowLeft className="size-4" /> Partner Login
                    </Link>
                    <div className="flex items-center gap-2 font-bold">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#F97316] text-white">
                            <Building2 />
                        </span>
                        <span className="hidden sm:inline">Explore Hinoba-an Partner Registration</span>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-5 py-12">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-xs font-bold tracking-[.2em] text-[#F97316] uppercase">Become an official tourism partner</span>
                    <h1 className="mt-3 text-4xl font-extrabold">Register Your Tourism Enterprise</h1>
                    <p className="mt-4 leading-7 text-[#64748B]">
                        Submit your account, business information, location, branding, and legal document for review by the Municipal Tourism Office.
                    </p>
                </div>
                <form onSubmit={submit} className="mt-10 grid gap-7">
                    <Section icon={UserRound} title="Partner account" description="These credentials will be used to access your enterprise portal.">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Full name"
                                name="name"
                                value={form.data.name}
                                onChange={(value) => form.setData('name', value)}
                                error={form.errors.name}
                            />
                            <Field
                                label="Phone number"
                                name="account_phone"
                                value={form.data.account_phone}
                                onChange={(value) => form.setData('account_phone', value)}
                                error={form.errors.account_phone}
                            />
                            <Field
                                label="Account email"
                                name="account_email"
                                type="email"
                                value={form.data.account_email}
                                onChange={(value) => form.setData('account_email', value)}
                                error={form.errors.account_email}
                            />
                            <div />
                            <Field
                                label="Password"
                                name="password"
                                type="password"
                                value={form.data.password}
                                onChange={(value) => form.setData('password', value)}
                                error={form.errors.password}
                            />
                            <Field
                                label="Confirm password"
                                name="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(value) => form.setData('password_confirmation', value)}
                                error={form.errors.password_confirmation}
                            />
                        </div>
                    </Section>
                    <Section icon={Building2} title="Business information" description="Tell visitors and the Tourism Office about your enterprise.">
                        <div className="grid gap-5 md:grid-cols-2">
                            <Field
                                label="Business name"
                                name="business_name"
                                value={form.data.business_name}
                                onChange={(value) => form.setData('business_name', value)}
                                error={form.errors.business_name}
                            />
                            <SelectField
                                label="Enterprise type"
                                name="enterprise_type_id"
                                value={form.data.enterprise_type_id}
                                options={enterpriseTypes}
                                onChange={(value) => form.setData('enterprise_type_id', value)}
                                error={form.errors.enterprise_type_id}
                            />
                            <Field
                                label="Contact person"
                                name="contact_person"
                                value={form.data.contact_person}
                                onChange={(value) => form.setData('contact_person', value)}
                                error={form.errors.contact_person}
                            />
                            <Field
                                label="License / registration number"
                                name="license_number"
                                value={form.data.license_number}
                                onChange={(value) => form.setData('license_number', value)}
                                error={form.errors.license_number}
                                required={false}
                            />
                            <Field
                                label="Business email"
                                name="business_email"
                                type="email"
                                value={form.data.business_email}
                                onChange={(value) => form.setData('business_email', value)}
                                error={form.errors.business_email}
                            />
                            <Field
                                label="Business phone"
                                name="business_phone"
                                value={form.data.business_phone}
                                onChange={(value) => form.setData('business_phone', value)}
                                error={form.errors.business_phone}
                            />
                            <Field
                                label="Website"
                                name="website"
                                type="url"
                                value={form.data.website}
                                onChange={(value) => form.setData('website', value)}
                                error={form.errors.website}
                                required={false}
                            />
                        </div>
                        <div className="mt-5 grid gap-2">
                            <Label htmlFor="description">Business description</Label>
                            <textarea
                                id="description"
                                rows={5}
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                className="rounded-xl border bg-white px-4 py-3 text-sm"
                            />
                            <InputError message={form.errors.description} />
                        </div>
                    </Section>
                    <Section
                        icon={MapPin}
                        title="Business location"
                        description="Accurate coordinates allow approved enterprises to appear on the tourism map."
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <SelectField
                                label="Barangay"
                                name="barangay_id"
                                value={form.data.barangay_id}
                                options={barangays}
                                onChange={(value) => form.setData('barangay_id', value)}
                                error={form.errors.barangay_id}
                            />
                            <div className="md:col-span-2">
                                <Field
                                    label="Complete address"
                                    name="address"
                                    value={form.data.address}
                                    onChange={(value) => form.setData('address', value)}
                                    error={form.errors.address}
                                />
                            </div>
                            <Field
                                label="Latitude"
                                name="latitude"
                                type="number"
                                value={form.data.latitude}
                                onChange={(value) => form.setData('latitude', value)}
                                error={form.errors.latitude}
                                required={false}
                            />
                            <Field
                                label="Longitude"
                                name="longitude"
                                type="number"
                                value={form.data.longitude}
                                onChange={(value) => form.setData('longitude', value)}
                                error={form.errors.longitude}
                                required={false}
                            />
                        </div>
                        <div className="mt-5">
                            <LocationPicker
                                latitude={form.data.latitude}
                                longitude={form.data.longitude}
                                onChange={(latitude, longitude) => {
                                    form.setData('latitude', latitude);
                                    form.setData('longitude', longitude);
                                }}
                            />
                        </div>
                    </Section>
                    <Section icon={Building2} title="Business branding" description="Upload images that represent your enterprise.">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <Label>Business logo</Label>
                                <ImageUploader
                                    files={form.data.logo ? [form.data.logo] : []}
                                    onChange={(files) => form.setData('logo', files[0] ?? null)}
                                    multiple={false}
                                    maxFiles={1}
                                    maxSizeMb={2}
                                    error={form.errors.logo}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label>Cover image</Label>
                                <ImageUploader
                                    files={form.data.cover_image ? [form.data.cover_image] : []}
                                    onChange={(files) => form.setData('cover_image', files[0] ?? null)}
                                    multiple={false}
                                    maxFiles={1}
                                    maxSizeMb={5}
                                    error={form.errors.cover_image}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </Section>
                    <Section
                        icon={FileText}
                        title="Legal documents"
                        description="Submit at least one permit, registration, accreditation, or supporting document."
                    >
                        <div className="grid gap-4">
                            {form.data.documents.map((document, index) => (
                                <div key={index} className="grid gap-4 rounded-2xl border border-orange-100 p-4 md:grid-cols-2">
                                    <SelectField
                                        label="Document type"
                                        name={`document_type_${index}`}
                                        value={document.document_type}
                                        options={[
                                            'Business Permit',
                                            'DTI Registration',
                                            'SEC Registration',
                                            "Mayor's Permit",
                                            'Barangay Clearance',
                                            'BIR Registration',
                                            'Sanitary Permit',
                                            'Fire Safety Certificate',
                                            'DOT Accreditation',
                                            'Government ID',
                                            'Other',
                                        ].map((name, id) => ({ id, name }))}
                                        onChange={(value) => updateDocument(index, { document_type: value })}
                                        error={form.errors[`documents.${index}.document_type`]}
                                        useNameValue
                                    />
                                    <Field
                                        label="Document number"
                                        name={`document_number_${index}`}
                                        value={document.document_number}
                                        onChange={(value) => updateDocument(index, { document_number: value })}
                                        error={form.errors[`documents.${index}.document_number`]}
                                        required={false}
                                    />
                                    <Field
                                        label="Expiration date"
                                        name={`expiration_date_${index}`}
                                        type="date"
                                        value={document.expiration_date}
                                        onChange={(value) => updateDocument(index, { expiration_date: value })}
                                        error={form.errors[`documents.${index}.expiration_date`]}
                                        required={false}
                                    />
                                    <div className="grid gap-2">
                                        <Label htmlFor={`document_file_${index}`}>Document file</Label>
                                        <Input
                                            id={`document_file_${index}`}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                                            onChange={(e) => updateDocument(index, { file: e.target.files?.[0] ?? null })}
                                            required
                                        />
                                        <InputError message={form.errors[`documents.${index}.file`]} />
                                    </div>
                                    {form.data.documents.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="text-red-600 md:col-span-2"
                                            onClick={() =>
                                                form.setData(
                                                    'documents',
                                                    form.data.documents.filter((_, documentIndex) => documentIndex !== index),
                                                )
                                            }
                                        >
                                            <Trash2 /> Remove document
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => form.setData('documents', [...form.data.documents, emptyDocument()])}
                        >
                            <Plus /> Add another document
                        </Button>
                    </Section>
                    <label className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white p-5 text-sm">
                        <input
                            type="checkbox"
                            checked={form.data.terms}
                            onChange={(e) => form.setData('terms', e.target.checked)}
                            className="mt-1 size-4"
                        />
                        <span>
                            I confirm that the information is accurate, I am authorized to represent this business, and I consent to verification by
                            the Municipal Tourism Office.
                        </span>
                    </label>
                    <InputError message={form.errors.terms} />
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button variant="outline" asChild>
                            <Link href={route('partner.login')}>Cancel</Link>
                        </Button>
                        <Button disabled={form.processing} className="bg-[#F97316] hover:bg-[#C2410C]">
                            {form.processing && <LoaderCircle className="animate-spin" />} Submit Application
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}

function Section({ icon: Icon, title, description, children }: { icon: typeof Building2; title: string; description: string; children: ReactNode }) {
    return (
        <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#F97316]">
                    <Icon />
                </span>
                <div>
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="mt-1 text-sm text-[#64748B]">{description}</p>
                </div>
            </div>
            {children}
        </section>
    );
}
function Field({
    label,
    name,
    value,
    onChange,
    error,
    type = 'text',
    required = true,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                type={type}
                step={type === 'number' ? 'any' : undefined}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="h-11"
            />
            <InputError message={error} />
        </div>
    );
}
function SelectField({
    label,
    name,
    value,
    options,
    onChange,
    error,
    useNameValue = false,
}: {
    label: string;
    name: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    error?: string;
    useNameValue?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name}>{label}</Label>
            <select
                id={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className="h-11 rounded-md border bg-white px-3 text-sm"
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option.id} value={useNameValue ? option.name : option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
            <InputError message={error} />
        </div>
    );
}
