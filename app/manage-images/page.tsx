"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageData {
    url: string;
    key: string;
    lastModified?: string;
    size?: number;
}

export default function ManageImages() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Dashboard states
    const [images, setImages] = useState<ImageData[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Delete modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<ImageData | null>(null);

    // Rename modal state
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [imageToRename, setImageToRename] = useState<ImageData | null>(null);
    const [newFilename, setNewFilename] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);

    const filteredImages = images.filter((img) =>
        img.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                fetchImages();
            } else {
                setError("Invalid password");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchImages = async () => {
        setIsFetching(true);
        try {
            const res = await fetch("/api/images");
            const data = await res.json();
            if (data.images) {
                setImages(data.images);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const handleDeleteClick = (image: ImageData) => {
        setImageToDelete(image);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!imageToDelete) return;

        const key = imageToDelete.key;
        setShowDeleteModal(false);
        setDeletingKey(key);

        try {
            const res = await fetch("/api/images", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key, password }),
            });

            if (res.ok) {
                setImages((prev) => prev.filter((img) => img.key !== key));
            } else {
                alert("Failed to delete image");
            }
        } catch (error) {
            alert("Error deleting image");
        } finally {
            setDeletingKey(null);
            setImageToDelete(null);
        }
    };

    const handleRenameClick = (image: ImageData) => {
        setImageToRename(image);
        setNewFilename(image.key);
        setShowRenameModal(true);
    };

    const confirmRename = async () => {
        if (!imageToRename || !newFilename || newFilename === imageToRename.key) return;

        setIsRenaming(true);
        try {
            const res = await fetch("/api/images", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldKey: imageToRename.key,
                    newKey: newFilename,
                    password
                }),
            });

            if (res.ok) {
                // Refetch all images to get the correct URLs
                await fetchImages();
                setShowRenameModal(false);
                setImageToRename(null);
                setNewFilename("");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to rename image");
            }
        } catch (error) {
            alert("Error renaming image");
        } finally {
            setIsRenaming(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#10162F] p-4">
                <div className="max-w-md w-full bg-[#1F2937] rounded-2xl p-8 border-2 border-[#FFD300]/20 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#FFD300] mb-2">Internal Gateway</h1>
                        <p className="text-gray-400">Enter password to access</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full bg-[#10162F] border-2 border-gray-600 focus:border-[#FFD300] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full bg-[#FFD300] text-[#10162F] font-black uppercase tracking-wider py-3 rounded-xl hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Verifying..." : "Access Dashboard"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#10162F] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#FFD300]">Image Management</h1>
                        <p className="text-gray-400 mt-1">Manage your cloud storage</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search images..."
                                className="bg-[#1F2937] border border-gray-600 focus:border-[#FFD300] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none transition-all w-64"
                            />
                            <svg
                                className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="bg-[#FFD300] text-[#10162F] px-6 py-2 font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="bg-[#1F2937] rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800/50 border-b border-gray-700">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-300">Preview</th>
                                    <th className="p-4 font-semibold text-gray-300">Filename / Key</th>
                                    <th className="p-4 font-semibold text-gray-300">Size</th>
                                    <th className="p-4 font-semibold text-gray-300">Uploaded</th>
                                    <th className="p-4 font-semibold text-gray-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {isFetching ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">
                                            Loading images...
                                        </td>
                                    </tr>
                                ) : filteredImages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-400">
                                            {searchQuery ? "No matching images found" : "No images found"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredImages.map((img) => (
                                        <tr key={img.key} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
                                                    <Image
                                                        src={img.url}
                                                        alt={img.key}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-mono text-sm text-[#FFD300] truncate max-w-[200px]" title={img.key}>
                                                    {img.key}
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {img.size ? (img.size / 1024).toFixed(2) + " KB" : "-"}
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {img.lastModified ? new Date(img.lastModified).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleRenameClick(img)}
                                                        className="bg-[#FFD300] text-[#10162F] px-6 py-2 font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
                                                    >
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(img)}
                                                        disabled={deletingKey === img.key}
                                                        className="bg-[#FFD300] text-[#10162F] px-6 py-2 font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-y-1 hover:shadow-none active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap flex items-center gap-2"
                                                    >
                                                        {deletingKey === img.key ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Rename Modal */}
            {showRenameModal && imageToRename && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1F2937] rounded-2xl max-w-md w-full border-2 border-[#FFD300]/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 text-[#FFD300]">
                                <div className="p-3 bg-[#FFD300]/10 rounded-xl">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Rename Image</h3>
                                    <p className="text-sm text-gray-400">Enter a new filename</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Filename</label>
                                <input
                                    type="text"
                                    value={newFilename}
                                    onChange={(e) => setNewFilename(e.target.value)}
                                    className="w-full bg-[#10162F] border border-gray-600 focus:border-[#FFD300] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all"
                                    placeholder="image.jpg"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowRenameModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRename}
                                    disabled={isRenaming || !newFilename || newFilename === imageToRename.key}
                                    className="flex-1 px-4 py-3 bg-[#FFD300] hover:bg-[#FFD300]/90 text-[#10162F] rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRenaming ? "Renaming..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && imageToDelete && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#1F2937] rounded-2xl max-w-md w-full border-2 border-red-500/20 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4 text-red-400">
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Delete Image?</h3>
                                    <p className="text-sm text-gray-400">This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                                <Image
                                    src={imageToDelete.url}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                                <p className="text-red-300 text-sm font-medium">
                                    Are you sure you want to permanently delete <span className="text-white font-mono">{imageToDelete.key}</span>?
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
