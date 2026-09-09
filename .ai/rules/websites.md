---
paths:
  - 'app/{Services,Http/Controllers,Models}/**/EnterpriseWebsite*.php, resources/js/{components/tourism-enterprise,pages/tourism-enterprise/websites}/**/*'
---

# Websites

## Enterprise CMS modules are type-scoped
Keep common microsite content in enterprise_websites/enterprise_sections. Resolve specialized sidebar modules through EnterpriseWebsiteModuleRegistry, reuse enterprise_services/local_products/reservations where equivalent, and store menus, tours/itineraries, and guide specializations in their dedicated tables. Every module endpoint must check both enterprise ownership and supported enterprise type.
