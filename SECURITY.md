# Security Policy

## Supported Versions

| Version | Supported      |
| ------- | -------------- |
| 1.x.x   | ✅ Current     |
| < 1.0   | ❌ Unsupported |

## Reporting a Vulnerability

The NeoCode team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose them.

If you discover a security vulnerability, please **do not open a public issue**. Instead, send an email to: **security@neocode.ai**

Please include:

1. **Description of the vulnerability**
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Any proof-of-concept code** (if available)

## Response Timeline

- **Initial response**: Within 48 hours
- **Detailed assessment**: Within 7 days
- **Patch release**: Based on severity assessment
- **Public disclosure**: After patch is available

## Security Best Practices

### For Users

- Keep NeoCode updated to the latest version
- Review permission settings carefully
- Use in trusted environments
- Monitor access logs regularly

### For Developers

- Validate all user inputs
- Use principle of least privilege
- Keep dependencies updated
- Follow secure coding practices

## Security Features

- **Input validation** with Zod schemas
- **Permission system** for tool access
- **Session isolation** between users
- **Audit logging** for actions
- **Sandboxed execution** environments

## Security Updates

Security updates are announced through:

- GitHub Security Advisories
- Release notes
- Discord announcements
- Email notifications (for critical issues)

## Credits

We acknowledge and thank security researchers who help us keep NeoCode secure. All valid security reports will be credited in our release notes.

## License

This security policy is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
