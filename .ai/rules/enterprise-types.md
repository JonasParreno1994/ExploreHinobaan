---
paths:
  - 'app/{Services,Http/Controllers,Models}/**/EnterpriseWebsite*.php, app/Models/EnterpriseType.php, resources/js/{components/tourism-enterprise,pages/admin/enterprise-types}/**/*'
---

# Enterprise Types

## Configure microsite modules per enterprise type
EnterpriseType.website_modules is the administrator-controlled module matrix. EnterpriseWebsiteModuleRegistry provides the validated catalog and legacy defaults; all CMS menus and module authorization must resolve through it. Any active future enterprise type may use the common CMS without adding its name to a hardcoded allow-list.
