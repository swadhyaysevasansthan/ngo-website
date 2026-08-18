import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { eventPassAPI } from '../../utils/api';
import Card from '../Card';
import Button from '../Button';

const EventsManager = ({ events, onEventsUpdated, onOpenNewEvent }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    name: '',
    slug: '',
    description: '',
    eventDate: '',
    venue: '',
  });

  const openCreateModal = () => {
    setEditingEvent(null);
    setEventForm({ name: '', slug: '', description: '', eventDate: '', venue: '' });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      slug: event.slug,
      description: event.description || '',
      eventDate: event.event_date ? event.event_date.split('T')[0] : '',
      venue: event.venue || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const res = await eventPassAPI.updateEvent(editingEvent.id, {
          ...eventForm,
          status: editingEvent.status,
        });
        if (res.data.success) {
          toast.success('Event updated successfully');
          setShowModal(false);
          setEditingEvent(null);
          onEventsUpdated();
        }
      } else {
        const res = await eventPassAPI.createEvent(eventForm);
        if (res.data.success) {
          toast.success('Event created successfully');
          setShowModal(false);
          onEventsUpdated();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleToggleStatus = async (event, newStatus) => {
    try {
      const res = await eventPassAPI.updateEvent(event.id, {
        name: event.name,
        slug: event.slug,
        description: event.description || '',
        eventDate: event.event_date ? event.event_date.split('T')[0] : '',
        venue: event.venue || '',
        status: newStatus,
      });
      if (res.data.success) {
        toast.success(`Event status updated to ${newStatus}`);
        onEventsUpdated();
      }
    } catch {
      toast.error('Failed to change event status');
    }
  };

  return (
    <>
      <Card className="p-5 border border-gray-100">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h3 className="font-bold text-gray-800 text-lg">All Physical Events</h3>
          <Button variant="primary" className="text-xs px-4 py-2 hover:scale-100" onClick={openCreateModal}>
            ➕ Create Event
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold">
                <th className="p-3">Event Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Date</th>
                <th className="p-3">Venue</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-gray-50/50">
                  <td className="p-3 font-semibold text-slate-800">{evt.name}</td>
                  <td className="p-3 font-mono text-xs text-gray-500">{evt.slug}</td>
                  <td className="p-3 text-gray-600">
                    {evt.event_date ? new Date(evt.event_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-3 text-gray-600 text-xs">{evt.venue || 'N/A'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        evt.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : evt.status === 'draft'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {evt.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      className="text-xs px-2.5 py-1 rounded-lg border hover:bg-gray-50 text-slate-700"
                      onClick={() => openEditModal(evt)}
                    >
                      Edit Details
                    </button>
                    {evt.status === 'draft' && (
                      <button
                        className="text-xs px-2.5 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-700"
                        onClick={() => handleToggleStatus(evt, 'active')}
                      >
                        Activate
                      </button>
                    )}
                    {evt.status === 'active' && (
                      <button
                        className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700"
                        onClick={() => handleToggleStatus(evt, 'completed')}
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-gray-400 py-8">
                    No events created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {editingEvent ? 'Edit Event Details' : 'Create New Event'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  value={eventForm.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const slugVal = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setEventForm({
                      ...eventForm,
                      name: val,
                      slug: editingEvent ? eventForm.slug : slugVal,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  placeholder="e.g. SNEPC Annual Exhibition 2026"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Unique URL Slug *</label>
                <input
                  type="text"
                  required
                  value={eventForm.slug}
                  onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono"
                  placeholder="e.g. snepc-2026"
                  disabled={!!editingEvent}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Event Date</label>
                <input
                  type="date"
                  value={eventForm.eventDate}
                  onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Venue / Physical Location</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  placeholder="e.g. Exhibition Hall, Swadhyay Ashram"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  rows="3"
                  placeholder="Details and scheduling details..."
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  className="text-xs px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold text-gray-600"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" className="text-xs py-2 px-5 hover:scale-100">
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsManager;
