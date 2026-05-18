import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { communityAPI } from '../utils/api';
import { Plus, Trash2, Save, X, Upload, Eye, EyeOff } from 'lucide-react';

const CommunityAdminTab = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicDetail, setTopicDetail] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: '', description: '', display_order: 0 });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const heroInputRef = useRef(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', event_date: '', event_type: 'past' });
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionForm, setSectionForm] = useState({ heading: '', content: '', section_type: 'general' });
  const [showStatForm, setShowStatForm] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [statForm, setStatForm] = useState({ label: '', value: '', icon: '' });

  useEffect(() => { fetchTopics(); }, []);

  const fetchTopics = async () => { try { const res = await communityAPI.adminGetAll(); setTopics(res.data.data); } catch (err) { toast.error('Failed to load communities'); } finally { setLoading(false); } };
  const fetchTopicDetail = async (id) => { try { const res = await communityAPI.adminGetById(id); setTopicDetail(res.data.data); } catch (err) { toast.error('Failed to load topic'); } };

  const handleCreateTopic = async (e) => { e.preventDefault(); if (!newTopic.title.trim()) return toast.error('Title required'); try { await communityAPI.adminCreate(newTopic); toast.success('Created!'); setShowCreateForm(false); setNewTopic({ title: '', description: '', display_order: 0 }); fetchTopics(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };
  const handleUpdateTopic = async () => { if (!topicDetail) return; try { await communityAPI.adminUpdate(topicDetail.id, { title: topicDetail.title, description: topicDetail.description, is_active: topicDetail.is_active, display_order: topicDetail.display_order }); toast.success('Updated!'); fetchTopics(); } catch (err) { toast.error('Failed to update'); } };
  const handleDeleteTopic = async (id) => { if (!window.confirm('Delete this topic and ALL its data?')) return; try { await communityAPI.adminDelete(id); toast.success('Deleted'); setTopicDetail(null); fetchTopics(); } catch (err) { toast.error('Failed'); } };

  const handleImageUpload = async (e) => { const files = e.target.files; if (!files?.length || !topicDetail) return; setUploading(true); const fd = new FormData(); for (let i = 0; i < files.length; i++) fd.append('images', files[i]); try { await communityAPI.uploadImages(topicDetail.id, fd); toast.success(`${files.length} image(s) uploaded!`); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Upload failed'); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; } };
  const handleHeroUpload = async (e) => { const file = e.target.files?.[0]; if (!file || !topicDetail) return; setUploading(true); const fd = new FormData(); fd.append('image', file); try { await communityAPI.uploadHeroImage(topicDetail.id, fd); toast.success('Hero updated!'); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Upload failed'); } finally { setUploading(false); if (heroInputRef.current) heroInputRef.current.value = ''; } };
  const handleRemoveHero = async () => { if (!window.confirm('Remove hero image?')) return; try { await communityAPI.deleteHeroImage(topicDetail.id); toast.success('Hero removed'); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };
  const handleDeleteImage = async (imageId) => { if (!window.confirm('Delete?')) return; try { await communityAPI.deleteImage(imageId); toast.success('Deleted'); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };

  const handleSaveEvent = async (e) => { e.preventDefault(); if (!eventForm.title.trim()) return toast.error('Title required'); try { if (editingEvent) { await communityAPI.updateEvent(editingEvent.id, eventForm); } else { await communityAPI.createEvent(topicDetail.id, eventForm); } toast.success('Saved!'); setShowEventForm(false); setEditingEvent(null); setEventForm({ title: '', description: '', event_date: '', event_type: 'past' }); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };
  const handleDeleteEvent = async (eventId) => { if (!window.confirm('Delete?')) return; try { await communityAPI.deleteEvent(eventId); toast.success('Deleted'); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };

  const handleSaveSection = async (e) => { e.preventDefault(); if (!sectionForm.heading.trim()) return toast.error('Heading required'); try { if (editingSection) { await communityAPI.updateSection(editingSection.id, sectionForm); } else { await communityAPI.createSection(topicDetail.id, sectionForm); } toast.success('Saved!'); setShowSectionForm(false); setEditingSection(null); setSectionForm({ heading: '', content: '', section_type: 'general' }); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };
  const handleDeleteSection = async (sectionId) => { if (!window.confirm('Delete?')) return; try { await communityAPI.deleteSection(sectionId); toast.success('Deleted'); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };

  const handleSaveStat = async (e) => { e.preventDefault(); if (!statForm.label.trim() || !statForm.value.trim()) return toast.error('Label and value required'); try { if (editingStat) { await communityAPI.updateStat(editingStat.id, statForm); } else { await communityAPI.createStat(topicDetail.id, statForm); } toast.success('Saved!'); setShowStatForm(false); setEditingStat(null); setStatForm({ label: '', value: '', icon: '' }); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };
  const handleDeleteStat = async (statId) => { if (!window.confirm('Delete?')) return; try { await communityAPI.deleteStat(statId); toast.success('Deleted'); fetchTopicDetail(topicDetail.id); } catch (err) { toast.error('Failed'); } };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  if (topicDetail) return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setTopicDetail(null)} className="text-primary hover:underline font-semibold">← Back</button>
        <button onClick={() => handleDeleteTopic(topicDetail.id)} className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"><Trash2 size={14} /> Delete Topic</button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Topic Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input type="text" value={topicDetail.title} onChange={(e) => setTopicDetail({ ...topicDetail, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Order</label><input type="number" value={topicDetail.display_order} onChange={(e) => setTopicDetail({ ...topicDetail, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={topicDetail.description || ''} onChange={(e) => setTopicDetail({ ...topicDetail, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg resize-y min-h-[80px]" /></div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={topicDetail.is_active} onChange={(e) => setTopicDetail({ ...topicDetail, is_active: e.target.checked })} /><span className="text-sm">Active</span></label>
        </div>
        <button onClick={handleUpdateTopic} className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"><Save size={16} /> Save</button>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold mb-3">Hero Image</h3>
        {topicDetail.hero_image_url && <div className="relative mb-3"><img src={topicDetail.hero_image_url} alt="Hero" className="w-full h-48 object-cover rounded-lg" /><button onClick={handleRemoveHero} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md"><X size={14} /></button></div>}
        <input type="file" ref={heroInputRef} accept="image/*" onChange={handleHeroUpload} className="hidden" />
        <div className="flex gap-3">
          <button onClick={() => heroInputRef.current?.click()} disabled={uploading} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Hero'}</button>
          {topicDetail.hero_image_url && <button onClick={handleRemoveHero} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Trash2 size={16} /> Remove Hero</button>}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold">Gallery ({topicDetail.images?.length || 0})</h3><div><input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleImageUpload} className="hidden" /><button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90"><Plus size={16} /> {uploading ? 'Uploading...' : 'Add Images'}</button></div></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">{topicDetail.images?.map((img) => (<div key={img.id} className="relative group rounded-lg overflow-hidden"><img src={img.image_url} alt="" className="w-full h-28 object-cover" /><button onClick={() => handleDeleteImage(img.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full shadow-md"><X size={14} /></button></div>))}</div>
        {(!topicDetail.images || topicDetail.images.length === 0) && <p className="text-gray-400 text-sm text-center py-8">No images yet.</p>}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold">Stats</h3><button onClick={() => { setShowStatForm(true); setEditingStat(null); setStatForm({ label: '', value: '', icon: '' }); }} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button></div>
        {showStatForm && <form onSubmit={handleSaveStat} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3"><div className="grid grid-cols-3 gap-3"><input placeholder="Value" value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input placeholder="Label" value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input placeholder="Icon" value={statForm.icon} onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /></div><div className="flex gap-2"><button type="submit" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm">Save</button><button type="button" onClick={() => setShowStatForm(false)} className="text-gray-500 text-sm">Cancel</button></div></form>}
        <div className="space-y-2">{topicDetail.stats?.map((stat) => (<div key={stat.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2"><span><strong>{stat.value}</strong> — {stat.label}</span><div className="flex gap-2"><button onClick={() => { setEditingStat(stat); setStatForm(stat); setShowStatForm(true); }} className="text-blue-600 text-xs">Edit</button><button onClick={() => handleDeleteStat(stat.id)} className="text-red-600 text-xs">Delete</button></div></div>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold">Sections</h3><button onClick={() => { setShowSectionForm(true); setEditingSection(null); setSectionForm({ heading: '', content: '', section_type: 'general' }); }} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button></div>
        {showSectionForm && <form onSubmit={handleSaveSection} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3"><input placeholder="Heading" value={sectionForm.heading} onChange={(e) => setSectionForm({ ...sectionForm, heading: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" /><textarea placeholder="Content (use double line break for quote section)" value={sectionForm.content} onChange={(e) => setSectionForm({ ...sectionForm, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm resize-y min-h-[80px]" /><select value={sectionForm.section_type} onChange={(e) => setSectionForm({ ...sectionForm, section_type: e.target.value })} className="px-3 py-2 border rounded-lg text-sm"><option value="general">Full Width (with quote)</option><option value="card">Card (side by side)</option></select><div className="flex gap-2"><button type="submit" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm">Save</button><button type="button" onClick={() => setShowSectionForm(false)} className="text-gray-500 text-sm">Cancel</button></div></form>}
        <div className="space-y-3">{topicDetail.sections?.map((s) => (<div key={s.id} className="bg-gray-50 rounded-lg p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><h4 className="font-semibold">{s.heading}</h4><span className={`text-xs px-2 py-0.5 rounded-full ${s.section_type === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'}`}>{s.section_type}</span></div><div className="flex gap-2"><button onClick={() => { setEditingSection(s); setSectionForm(s); setShowSectionForm(true); }} className="text-blue-600 text-xs">Edit</button><button onClick={() => handleDeleteSection(s.id)} className="text-red-600 text-xs">Delete</button></div></div>{s.content && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{s.content}</p>}</div>))}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-3"><h3 className="text-lg font-bold">Events</h3><button onClick={() => { setShowEventForm(true); setEditingEvent(null); setEventForm({ title: '', description: '', event_date: '', event_type: 'past' }); }} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus size={14} /> Add</button></div>
        {showEventForm && <form onSubmit={handleSaveEvent} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3"><div className="grid md:grid-cols-2 gap-3"><input placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /><input placeholder="Date (e.g. Feb 2024)" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" /></div><textarea placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm resize-y min-h-[60px]" /><select value={eventForm.event_type} onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })} className="px-3 py-2 border rounded-lg text-sm"><option value="past">Past</option><option value="ongoing">Ongoing</option><option value="future">Upcoming</option></select><div className="flex gap-2"><button type="submit" className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm">Save</button><button type="button" onClick={() => setShowEventForm(false)} className="text-gray-500 text-sm">Cancel</button></div></form>}
        <div className="space-y-2">{topicDetail.events?.map((ev) => (<div key={ev.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"><div><span className="font-medium">{ev.title}</span><span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${ev.event_type === 'past' ? 'bg-gray-200 text-gray-600' : ev.event_type === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{ev.event_type}</span>{ev.event_date && <span className="text-xs text-gray-500 ml-2">{ev.event_date}</span>}</div><div className="flex gap-2"><button onClick={() => { setEditingEvent(ev); setEventForm(ev); setShowEventForm(true); }} className="text-blue-600 text-xs">Edit</button><button onClick={() => handleDeleteEvent(ev.id)} className="text-red-600 text-xs">Delete</button></div></div>))}</div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">🌿 Community Topics</h2><button onClick={() => setShowCreateForm(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90"><Plus size={16} /> New Topic</button></div>
      {showCreateForm && <form onSubmit={handleCreateTopic} className="bg-white rounded-2xl shadow-md p-6 mb-6 space-y-4"><h3 className="font-bold text-lg">Create New Topic</h3><input placeholder="Title (e.g. Natural Farming)" value={newTopic.title} onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /><textarea placeholder="Description" value={newTopic.description} onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg resize-y min-h-[80px]" /><div className="flex gap-3"><button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg">Create</button><button type="button" onClick={() => setShowCreateForm(false)} className="text-gray-500">Cancel</button></div></form>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{topics.map((t) => (<div key={t.id} onClick={() => fetchTopicDetail(t.id)} className="bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100">{t.hero_image_url && <img src={t.hero_image_url} alt={t.title} className="w-full h-32 object-cover rounded-lg mb-3" />}<div className="flex items-center justify-between"><h3 className="font-bold text-gray-800">{t.title}</h3>{t.is_active ? <Eye size={16} className="text-green-500" /> : <EyeOff size={16} className="text-gray-400" />}</div><p className="text-sm text-gray-500 mt-1 line-clamp-2">{t.description}</p><div className="flex gap-3 mt-3 text-xs text-gray-400"><span>{t.image_count || 0} images</span><span>{t.event_count || 0} events</span></div></div>))}</div>
      {topics.length === 0 && !showCreateForm && <div className="text-center py-16 text-gray-400"><p className="text-lg mb-2">No topics yet</p><p className="text-sm">Click "New Topic" to start.</p></div>}
    </div>
  );
};

export default CommunityAdminTab;
