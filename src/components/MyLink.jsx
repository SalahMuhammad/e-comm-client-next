import Link from 'next/link';
import { LinkIcon } from '@heroicons/react/24/outline';



const underlineSlideConfig = {
    base: "group relative inline-flex items-center gap-2 py-1 font-medium text-slate-700 transition-colors hover:text-indigo-600",
    icon: "h-5 w-5 transition-transform duration-300 group-hover:translate-x-1",
    underline: "absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
};

const pilledConfig = {
    base: "inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 transition-all duration-200 hover:bg-indigo-600 hover:text-white hover:shadow-md active:scale-95",
    icon: "h-4 w-4 transition-colors",
};

const iconBoxConfig = {
    base: "inline-flex items-center gap-3 text-slate-600 transition-colors hover:text-slate-900 font-medium",
    iconWrapper: "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-sm",
    icon: "h-4 w-4",
};

export const floatingBorderConfig = {
    base: "group inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5",
    icon: "h-4 w-4 text-slate-400 transition-colors duration-300 group-hover:text-indigo-600",
};

export const inlineLinkIconConfig = {
    base: "group inline-flex items-center gap-2 text-slate-700 font-medium transition-colors hover:text-indigo-600",
    icon: "h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:scale-110 group-hover:text-indigo-600",
};

export function UnderlineSlideLink({ href, children, icon: Icon, ...props }) {
    return (
        <Link href={href} className={underlineSlideConfig.base} {...props}>
            <span>{children}</span>
            {Icon && <Icon className={underlineSlideConfig.icon} />}
            <span className={underlineSlideConfig.underline} aria-hidden="true" />
        </Link>
    );
}

export function PilledLink({ href, children, icon: Icon, ...props }) {
    return (
        <Link href={href} className={pilledConfig.base} {...props}>
            <span>{children}</span>
            {Icon && <Icon className={pilledConfig.icon} />}
        </Link>
    );
}

export function IconBoxLink({ href, children, icon: Icon, ...props }) {
    return (
        <Link href={href} className={`group ${iconBoxConfig.base}`} {...props}>
            <div className={iconBoxConfig.iconWrapper}>
                {Icon && <Icon className={iconBoxConfig.icon} />}
            </div>
            <span>{children}</span>
        </Link>
    );
}

export function FloatingBorderLink({ href, children, icon: Icon, ...props }) {
    return (
        <Link href={href} className={floatingBorderConfig.base} {...props}>
            {Icon && <Icon className={floatingBorderConfig.icon} />}
            <span>{children}</span>
        </Link>
    );
}

export function InlineLinkIcon({ href, children, ...props }) {
    return (
        <Link href={href} className={inlineLinkIconConfig.base} {...props}>
            <LinkIcon className={inlineLinkIconConfig.icon} />
            <span>{children}</span>
        </Link>
    );
}
