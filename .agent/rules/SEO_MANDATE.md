# SEO Optimization Mandate

## Mandatory Requirement for New Pages
Every time a new page or view is created in this project, the Engineer Agent MUST include SEO optimization by default.

### Implementation Checklist
1. **Import the SEO component**:
   ```tsx
   import SEO from '@/components/layout/SEO';
   ```

2. **Add the SEO component at the top of the returned JSX**:
   ```tsx
   return (
       <div className="...">
           <SEO 
               title="[Page Title] | Agencia Lumar" 
               description="[Compelling meta description of 150-160 characters]"
               url="https://agencialumar.es/[route]"
           />
           {/* Page Content */}
       </div>
   )
   ```

3. **Content Guidelines**:
   - **Title**: Must be unique and descriptive. Use the format `Page Name | Brand Name` or `Keyword Rich Phrase | Brand Name`.
   - **Description**: Must summarize the page content and encourage click-through. Avoid duplication.

## Maintenance
- When modifying existing page content substantially, **update the SEO description** to reflect changes.
- Ensure `sitemap.xml` is updated when new routes are added.

**DO NOT DEVIATE FROM THIS PROTOCOL.**
Semantically optimized content is a core deliverable, not an afterthought.
