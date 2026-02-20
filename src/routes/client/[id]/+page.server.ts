
import type { PageProps } from '../$types';

// import { getClient } from '../blog.remote';
let { params }: PageProps = $props();
export const load = async ({ params }) => {
    const clientId = params.id; // "abc-123"
};