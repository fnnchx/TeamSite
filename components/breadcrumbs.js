import { createTag } from '../utils/dom.js';
import { getBreadcrumbsForRoute } from '../navigation/routes.js';

export function createBreadcrumbs(currentHash) {
    const breadcrumbsData = getBreadcrumbsForRoute(currentHash);
    
    const breadcrumbsContainer = createTag('nav', {
        className: 'breadcrumbs',
        'aria-label': 'Breadcrumb navigation'
    });

    breadcrumbsData.forEach((crumb, index) => {
        if (index > 0) {
            const separator = createTag('span', {
                className: 'breadcrumb-separator',
                'aria-hidden': 'true'
            }, '›');
            breadcrumbsContainer.appendChild(separator);
        }

        const isActive = index === breadcrumbsData.length - 1;
        
        if (isActive) {
            const activeCrumb = createTag('span', {
                className: 'breadcrumb-active',
                'aria-current': 'page'
            }, crumb.name);
            breadcrumbsContainer.appendChild(activeCrumb);
        } else {
            const crumbLink = createTag('a', {
                href: crumb.path,
                className: 'breadcrumb-link'
            }, crumb.name);
            breadcrumbsContainer.appendChild(crumbLink);
        }
    });

    return breadcrumbsContainer;
}