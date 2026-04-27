const MARKETING_UNSUBSCRIBE_FOOTER = `<p style="margin:24px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
<a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6366f1;">Unsubscribe</a> from UWDSC marketing emails.
</p>`;

export function appendMarketingUnsubscribeFooter(html: string): string {
  if (html.includes("{{{RESEND_UNSUBSCRIBE_URL}}}")) {
    return html;
  }
  const closeBody = html.lastIndexOf("</body>");
  if (closeBody === -1) {
    return `${html}${MARKETING_UNSUBSCRIBE_FOOTER}`;
  }
  return (
    html.slice(0, closeBody) +
    MARKETING_UNSUBSCRIBE_FOOTER +
    html.slice(closeBody)
  );
}
