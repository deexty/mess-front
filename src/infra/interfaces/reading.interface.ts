export interface IReading {
    image_path: string;
    reference_date: string;
    status: 'pending' | 'processed' | 'errored' | 'in_progress' | 'review_needed';
    error_message?: string;
    qr_code_result?: string;
    red_digits?: string;
    black_digits?: string;
    review_reasons?: string;
}

export interface ICreateReading {
    reference_date: string;
    qr_code_result: string;
    red_digits: string;
    black_digits: string;
}
