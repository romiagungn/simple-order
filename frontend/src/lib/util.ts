export const formatRupiah = (amount: number) => {
   return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
   }).format(amount);
};

export const formatDate = (dateString: string) => {
   return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
   }).format(new Date(dateString));
};
