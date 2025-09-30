// components/UploadForm.tsx
import React from 'react';
import { Upload, Loader2, FileText, CheckCircle } from 'lucide-react';

interface UploadFormProps {
  onFileChange: React.FormEventHandler;
  onReset: React.FormEventHandler;
  onSubmit: React.FormEventHandler;
  //onClickExample: React.MouseEventHandler;
  file: File | null;
  error: string;
  loading: string;
  complete: boolean;
}

const UploadForm: React.FC<UploadFormProps> = (
  { onFileChange, onReset, onSubmit, file, error, loading, complete}) => {
    const isLoading = loading !== '';
    return (
        <div className="bg-white/75 rounded-lg shadow-xl p-8 w-full self-center">
            <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-800/10 rounded-full mb-4">
                <FileText className="w-8 h-8 text-green-800" />
            </div>
            <p className="text-gray-600 mt-2">Select a file (.txt or .csv) to upload and process</p>
        </div>

        {!complete ? (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
            <label htmlFor="file-upload" 
                   className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-800 hover:bg-green-800/10 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 text-green-800 mb-2" />
                <p className="text-sm text-gray-600">
                    {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-500 mt-1">.txt and .csv files only</p>
                </div>
                <input id="file-upload" 
                       type="file" 
                       className="hidden" 
                       accept=".txt,.csv,text/plain"
                       onChange={onFileChange}
                       disabled={isLoading}
                />
            </label>
            </div>

            {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
            </div>
            )}

            {/* TODO - Example inputs. */}
            {/*<div className="w-full self-center">
                <p className="text-gray-600 mt-2 py-2">Examples</p>
                <div className="flex flex-row gap-4">
                    <button type="submit"
                            className="w-full bg-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <span>Example 1</span>
                    </button>
                    <button type="submit"
                            className="w-full bg-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                        <span>Example 2</span>
                    </button>
                </div>
            </div>
            */}

            <button type="submit"
                    disabled={!file || isLoading}
                    className="w-full bg-green-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
                {isLoading ? (
                    <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {loading}
                    </>
                ) : (
                    'Upload and Process'
                )}
            </button>

        </form>
        ) : (
        <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Processing Complete!
            </h2>
            <p className="text-gray-600 mb-6">
                Your file has been successfully processed.
            </p>
            <button onClick={onReset}
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Upload Another File
            </button>
        </div>
        )}
    </div>
    );
};

export default UploadForm;