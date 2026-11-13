import dataStore from '../storage/dataStore.js';
import { sendContactNotificationEmail } from '../services/emailService.js';

// @desc    Submit contact or farmer inquiry
// @route   POST /api/contact
// @access  Public
export async function createContact(req, res) {
  try {
    const { name, email, phone, subject, message, farmerId, farmerName } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.',
      });
    }

    const contact = await dataStore.createContact({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Farm Dispatch Inquiry',
      message,
      farmerId: farmerId || '',
      farmerName: farmerName || '',
    });

    // Dispatch email notification to Root Admin (bikramdevsaw9@gmail.com)
    sendContactNotificationEmail({
      name,
      email,
      phone: phone || '',
      subject: subject || 'Farm Dispatch Inquiry',
      message,
      farmerId: farmerId || '',
      farmerName: farmerName || '',
    }).catch((emailErr) => {
      console.error('Email dispatch background error:', emailErr.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted and delivered directly to our team (bikramdevsaw9@gmail.com).',
      contact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit contact message.',
    });
  }
}

// @desc    Get all inquiries
// @route   GET /api/contact
// @access  Private (Admin Only)
export async function getContacts(req, res) {
  try {
    const contacts = await dataStore.getContacts();
    return res.json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages.',
    });
  }
}

// @desc    Update contact inquiry status
// @route   PATCH /api/contact/:id/status
// @access  Private (Admin Only)
export async function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await dataStore.updateContactStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    return res.json({
      success: true,
      message: `Message status updated to: ${status}`,
      contact: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update message status.' });
  }
}

// @desc    Delete contact inquiry
// @route   DELETE /api/contact/:id
// @access  Private (Admin Only)
export async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    await dataStore.deleteContact(id);
    return res.json({
      success: true,
      message: 'Message inquiry deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
}

