import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X,
  Eye,
  Download,
  Hash,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ipfsService } from '../../services/ipfsService';
import { Receipt } from '../../types';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

export function ReceiptUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedReceipts, setUploadedReceipts] = useState<Receipt[]>([
    {
      id: 'receipt_001',
      transactionId: 'tx_001',
      ipfsHash: 'bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m',
      fileName: 'spring-2024-tuition-receipt.pdf',
      uploadedAt: '2024-01-20T10:35:00Z',
      verified: true
    }
  ]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    // SRS 3.3.1: IPFS receipt storage
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      toast.error('Please upload a PDF or image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const result = await ipfsService.uploadReceipt(file);
      
      const newReceipt: Receipt = {
        id: `receipt_${Date.now()}`,
        transactionId: `tx_${Date.now()}`,
        ipfsHash: result.hash,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        verified: false
      };

      setUploadedReceipts([newReceipt, ...uploadedReceipts]);
      toast.success(`Receipt uploaded successfully! IPFS Hash: ${result.hash.slice(0, 20)}...`);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const verifyReceipt = async (receipt: Receipt) => {
    try {
      const isValid = await ipfsService.verifyReceipt(receipt.ipfsHash);
      
      setUploadedReceipts(uploadedReceipts.map(r => 
        r.id === receipt.id ? { ...r, verified: isValid } : r
      ));
      
      if (isValid) {
        toast.success('Receipt verified successfully!');
      } else {
        toast.error('Receipt verification failed');
      }
    } catch (error) {
      toast.error('Verification failed');
    }
  };

  const deleteReceipt = (receiptId: string) => {
    setUploadedReceipts(uploadedReceipts.filter(r => r.id !== receiptId));
    toast.success('Receipt deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">Receipt Upload</h1>
        <p className="text-indigo-100">
          Store payment receipts securely on IPFS for verification and audit trails
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Upload New Receipt</h2>
          </CardHeader>
          <CardContent>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${uploading ? 'pointer-events-none opacity-50' : ''}
              `}
            >
              <motion.div
                animate={uploading ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: uploading ? Infinity : 0, ease: 'linear' }}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              </motion.div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {uploading ? 'Uploading to IPFS...' : 'Upload Receipt'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag & drop your receipt file here, or click to browse
              </p>
              
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              
              <div className="text-xs text-gray-500">
                Supports: PDF, PNG, JPG (Max 5MB)
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Receipt List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                Uploaded Receipts ({uploadedReceipts.length})
              </h2>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="h-4 w-4" />}
              >
                Download All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {uploadedReceipts.map((receipt) => (
                  <motion.div
                    key={receipt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <File className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {receipt.fileName}
                          </h3>
                          {receipt.verified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Hash className="h-3 w-3" />
                            <span className="font-mono">
                              {receipt.ipfsHash.slice(0, 20)}...
                            </span>
                            <button
                              onClick={() => navigator.clipboard.writeText(receipt.ipfsHash)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Uploaded {format(parseISO(receipt.uploadedAt), 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!receipt.verified && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => verifyReceipt(receipt)}
                          icon={<CheckCircle className="h-4 w-4" />}
                        >
                          Verify
                        </Button>
                      )}
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(ipfsService.getGatewayUrl(receipt.ipfsHash), '_blank')}
                        icon={<Eye className="h-4 w-4" />}
                      >
                        View
                      </Button>
                      
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(ipfsService.getGatewayUrl(receipt.ipfsHash), '_blank')}
                        icon={<ExternalLink className="h-4 w-4" />}
                      >
                        IPFS
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteReceipt(receipt.id)}
                        icon={<X className="h-4 w-4" />}
                        className="p-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {uploadedReceipts.length === 0 && (
                <div className="text-center py-12">
                  <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No receipts uploaded</h3>
                  <p className="text-gray-400">
                    Upload your first receipt to get started
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* IPFS Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <Hash className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">IPFS Storage Benefits</h3>
            <p className="text-sm text-blue-800 mt-1">
              Your receipts are stored on the InterPlanetary File System (IPFS), providing permanent, 
              decentralized storage with cryptographic verification. Each file gets a unique hash 
              that ensures authenticity and prevents tampering.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}